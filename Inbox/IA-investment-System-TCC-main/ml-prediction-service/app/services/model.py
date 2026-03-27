import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error
import logging

from app.services.IndicadoresMercado import Indicadores

logger = logging.getLogger(__name__)

class Model:
    def __init__(self):
        self.indicadores = Indicadores()

    async def train_model(self, json_data):
        df = pd.DataFrame(json_data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date').reset_index(drop=True)

        # Target: preço de fechamento do próximo dia
        df['target'] = df['close'].shift(-1)

        # Feature Engineering — indicadores técnicos
        df['RSI_14'] = self.indicadores.compute_RSI(df['close'])
        df['STOCH_RSI'] = self.indicadores.get_stochastic_rsi(df['close'])
        df['MACD'] = self.indicadores.compute_MACD(df['close'])
        df['ATR_14'] = self.indicadores.compute_ATR(df['high'], df['low'], df['close'])
        df['OBV'] = self.indicadores.compute_OBV(df['close'], df['volume'])

        # Features de preço derivadas
        df['pct_change'] = df['close'].pct_change()
        df['high_low_ratio'] = df['high'] / df['low']
        df['close_open_ratio'] = df['close'] / df['open']

        # EMAs
        df['EMA_7'] = self.indicadores.compute_EMA(df['close'], 7)
        df['EMA_21'] = self.indicadores.compute_EMA(df['close'], 21)
        df['EMA_cross'] = df['EMA_7'] - df['EMA_21']

        # Bollinger Bands
        bb_upper, bb_lower = self.indicadores.compute_Bollinger_Bands(df['close'])
        df['BB_width'] = (bb_upper - bb_lower) / df['close']
        df['BB_position'] = (df['close'] - bb_lower) / (bb_upper - bb_lower)

        features = [
            'open', 'high', 'low', 'close', 'volume',
            'RSI_14', 'STOCH_RSI', 'MACD', 'ATR_14', 'OBV',
            'pct_change', 'high_low_ratio', 'close_open_ratio',
            'EMA_7', 'EMA_21', 'EMA_cross',
            'BB_width', 'BB_position'
        ]

        # Remover NaN
        df.dropna(inplace=True)

        if len(df) < 50:
            raise ValueError(f"Dados insuficientes para treino: {len(df)} registros (mínimo 50)")

        X = df[features]
        y = df['target']

        # Time Series Split
        tscv = TimeSeriesSplit(n_splits=5)

        # Grid Search mais enxuto (evitar timeout)
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
            verbose=1
        )
        gsearch.fit(X, y)
        best_model = gsearch.best_estimator_

        # Métricas
        predictions = best_model.predict(X)
        rmse = np.sqrt(mean_squared_error(y, predictions))
        mae = mean_absolute_error(y, predictions)

        logger.info(f"Best params: {gsearch.best_params_}")
        logger.info(f"RMSE: {rmse:.4f}, MAE: {mae:.4f}")

        # Predições e sinais
        df['predicted_close'] = predictions
        df['signal_ml'] = np.where(df['predicted_close'] > df['close'], 1, -1)

        # Confiança baseada na distância % entre preço atual e predição
        df['confidence'] = abs(df['predicted_close'] - df['close']) / df['close'] * 100

        # Feature importance
        importance = dict(zip(features, best_model.feature_importances_.tolist()))

        # Converter para JSON
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
                "rmse": round(rmse, 4),
                "mae": round(mae, 4),
                "best_params": gsearch.best_params_,
                "total_records": len(result),
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
