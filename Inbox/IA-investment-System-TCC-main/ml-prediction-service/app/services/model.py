import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib
import os
import logging
from datetime import datetime

from app.services.IndicadoresMercado import Indicadores

logger = logging.getLogger(__name__)

MODEL_DIR = os.getenv("MODEL_DIR", "/tmp/models")
os.makedirs(MODEL_DIR, exist_ok=True)


class Model:
    _cache: dict = {}  # {symbol: {model, features, trained_at, metrics}}

    def __init__(self):
        self.indicadores = Indicadores()

    def _model_path(self, symbol: str) -> str:
        return os.path.join(MODEL_DIR, f"model_{symbol}.joblib")

    def _prepare_features(self, json_data) -> pd.DataFrame:
        df = pd.DataFrame(json_data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date').reset_index(drop=True)

        df['target'] = df['close'].shift(-1)

        df['RSI_14'] = self.indicadores.compute_RSI(df['close'])
        df['STOCH_RSI'] = self.indicadores.get_stochastic_rsi(df['close'])
        df['MACD'] = self.indicadores.compute_MACD(df['close'])
        df['ATR_14'] = self.indicadores.compute_ATR(df['high'], df['low'], df['close'])
        df['OBV'] = self.indicadores.compute_OBV(df['close'], df['volume'])

        df['pct_change'] = df['close'].pct_change()
        df['high_low_ratio'] = df['high'] / df['low']
        df['close_open_ratio'] = df['close'] / df['open']

        df['EMA_7'] = self.indicadores.compute_EMA(df['close'], 7)
        df['EMA_21'] = self.indicadores.compute_EMA(df['close'], 21)
        df['EMA_cross'] = df['EMA_7'] - df['EMA_21']

        bb_upper, bb_lower = self.indicadores.compute_Bollinger_Bands(df['close'])
        df['BB_width'] = (bb_upper - bb_lower) / df['close']
        df['BB_position'] = (df['close'] - bb_lower) / (bb_upper - bb_lower)

        df.dropna(inplace=True)
        return df

    def _get_feature_cols(self) -> list:
        return [
            'open', 'high', 'low', 'close', 'volume',
            'RSI_14', 'STOCH_RSI', 'MACD', 'ATR_14', 'OBV',
            'pct_change', 'high_low_ratio', 'close_open_ratio',
            'EMA_7', 'EMA_21', 'EMA_cross',
            'BB_width', 'BB_position'
        ]

    async def train_model(self, json_data, symbol: str = "UNKNOWN"):
        df = self._prepare_features(json_data)

        if len(df) < 50:
            raise ValueError(f"Dados insuficientes para treino: {len(df)} registros (minimo 50)")

        features = self._get_feature_cols()
        X = df[features]
        y = df['target']

        # Split temporal: 80% treino, 20% teste
        split_idx = int(len(X) * 0.8)
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

        # Time Series CV no conjunto de treino
        tscv = TimeSeriesSplit(n_splits=5)

        param_grid = {
            'n_estimators': [100, 200],
            'max_depth': [10, 20],
            'min_samples_split': [2, 5],
            'min_samples_leaf': [1, 2],
        }

        model = RandomForestRegressor(random_state=42, n_jobs=-1)
        gsearch = GridSearchCV(
            estimator=model,
            cv=tscv,
            param_grid=param_grid,
            scoring='neg_mean_squared_error',
            n_jobs=-1,
            verbose=0
        )
        gsearch.fit(X_train, y_train)
        best_model = gsearch.best_estimator_

        # Metricas no TEST SET (dados nao vistos)
        test_predictions = best_model.predict(X_test)
        test_rmse = np.sqrt(mean_squared_error(y_test, test_predictions))
        test_mae = mean_absolute_error(y_test, test_predictions)

        # Metricas no treino para comparacao (detectar overfitting)
        train_predictions = best_model.predict(X_train)
        train_rmse = np.sqrt(mean_squared_error(y_train, train_predictions))

        logger.info(f"[{symbol}] Best params: {gsearch.best_params_}")
        logger.info(f"[{symbol}] Train RMSE: {train_rmse:.4f} | Test RMSE: {test_rmse:.4f} | Test MAE: {test_mae:.4f}")

        # Salvar modelo em disco
        model_path = self._model_path(symbol)
        joblib.dump(best_model, model_path)

        # Cache em memoria
        Model._cache[symbol] = {
            "model": best_model,
            "trained_at": datetime.utcnow().isoformat(),
            "records_used": len(df),
            "metrics": {
                "train_rmse": round(train_rmse, 4),
                "test_rmse": round(test_rmse, 4),
                "test_mae": round(test_mae, 4),
                "overfit_ratio": round(test_rmse / train_rmse, 2) if train_rmse > 0 else 0,
                "best_params": gsearch.best_params_,
            }
        }

        # Predicoes completas para retorno
        all_predictions = best_model.predict(X)
        df['predicted_close'] = all_predictions
        df['signal_ml'] = np.where(df['predicted_close'] > df['close'], 1, -1)
        df['confidence'] = abs(df['predicted_close'] - df['close']) / df['close'] * 100

        importance = dict(zip(features, best_model.feature_importances_.tolist()))

        result_df = df[['date', 'open', 'high', 'low', 'close', 'volume',
                        'RSI_14', 'MACD', 'predicted_close', 'signal_ml', 'confidence']]

        result = result_df.to_dict(orient='records')
        for row in result:
            for key, value in row.items():
                if isinstance(value, (np.int64, np.float64)):
                    row[key] = value.item()
                elif isinstance(value, pd.Timestamp):
                    row[key] = value.isoformat()

        return {
            "predictions": result,
            "metrics": {
                "train_rmse": round(train_rmse, 4),
                "test_rmse": round(test_rmse, 4),
                "test_mae": round(test_mae, 4),
                "overfit_ratio": round(test_rmse / train_rmse, 2) if train_rmse > 0 else 0,
                "best_params": gsearch.best_params_,
                "total_records": len(result),
                "train_size": split_idx,
                "test_size": len(X) - split_idx,
                "feature_importance": {k: round(v, 4) for k, v in
                    sorted(importance.items(), key=lambda x: x[1], reverse=True)}
            },
            "latest_signal": {
                "date": result[-1]['date'],
                "current_close": result[-1]['close'],
                "predicted_close": result[-1]['predicted_close'],
                "signal": "BUY" if result[-1]['signal_ml'] == 1 else "SELL",
                "confidence": round(result[-1]['confidence'], 2)
            }
        }

    async def predict(self, json_data, symbol: str = "UNKNOWN") -> dict:
        """Predicao rapida usando modelo cacheado. Treina se necessario."""
        # Tentar cache em memoria
        cached = Model._cache.get(symbol)

        # Tentar carregar do disco se nao tem em memoria
        if cached is None:
            model_path = self._model_path(symbol)
            if os.path.exists(model_path):
                try:
                    loaded_model = joblib.load(model_path)
                    cached = {"model": loaded_model, "trained_at": "loaded_from_disk"}
                    Model._cache[symbol] = cached
                    logger.info(f"[{symbol}] Modelo carregado do disco")
                except Exception as e:
                    logger.warning(f"[{symbol}] Erro ao carregar modelo do disco: {e}")

        # Se nao tem modelo, treinar
        if cached is None:
            logger.info(f"[{symbol}] Sem modelo cacheado, treinando...")
            result = await self.train_model(json_data, symbol)
            return result["latest_signal"]

        # Usar modelo cacheado para predicao rapida
        try:
            df = self._prepare_features(json_data)
            features = self._get_feature_cols()
            X = df[features]

            model = cached["model"]
            last_row = X.iloc[[-1]]
            predicted = model.predict(last_row)[0]
            current_close = df.iloc[-1]['close']

            signal = "BUY" if predicted > current_close else "SELL"
            confidence = abs(predicted - current_close) / current_close * 100

            return {
                "date": df.iloc[-1]['date'].isoformat() if isinstance(df.iloc[-1]['date'], pd.Timestamp) else str(df.iloc[-1]['date']),
                "current_close": float(current_close),
                "predicted_close": round(float(predicted), 2),
                "signal": signal,
                "confidence": round(float(confidence), 2),
                "model_trained_at": cached.get("trained_at", "unknown"),
                "cached": True
            }
        except Exception as e:
            logger.warning(f"[{symbol}] Erro na predicao cacheada, retreinando: {e}")
            result = await self.train_model(json_data, symbol)
            return result["latest_signal"]
