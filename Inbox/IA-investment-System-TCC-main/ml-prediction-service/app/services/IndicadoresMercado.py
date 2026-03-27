import numpy as np

class Indicadores:
    """Indicadores técnicos para análise de mercado crypto."""

    def compute_RSI(self, close, window=14):
        diff = close.diff(1).dropna()
        gain = (diff.where(diff > 0, 0)).rolling(window=window).mean()
        loss = (-diff.where(diff < 0, 0)).rolling(window=window).mean()
        RS = gain / loss
        return 100 - (100 / (1 + RS))

    def compute_Bollinger_Bands(self, close, window=20, nstd=2):
        rolling_mean = close.rolling(window=window).mean()
        rolling_std = close.rolling(window=window).std()
        upper = rolling_mean + (nstd * rolling_std)
        lower = rolling_mean - (nstd * rolling_std)
        return upper, lower

    def compute_MACD(self, close, short=12, long=26, signal=9):
        short_ema = close.ewm(span=short, adjust=False).mean()
        long_ema = close.ewm(span=long, adjust=False).mean()
        macd_line = short_ema - long_ema
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        return macd_line - signal_line

    def get_stochastic_rsi(self, close, window=14, stoch_window=14):
        rsi = self.compute_RSI(close, window)
        min_rsi = rsi.rolling(window=stoch_window).min()
        max_rsi = rsi.rolling(window=stoch_window).max()
        denom = max_rsi - min_rsi
        # Fix: evitar divisão por zero quando max_rsi == min_rsi
        denom = denom.replace(0, np.nan)
        stoch_rsi = (rsi - min_rsi) / denom
        return stoch_rsi.fillna(0.5)

    def compute_EMA(self, close, window):
        return close.ewm(span=window, adjust=False).mean()

    def compute_ATR(self, high, low, close, window=14):
        """Average True Range — mede volatilidade."""
        tr1 = high - low
        tr2 = abs(high - close.shift(1))
        tr3 = abs(low - close.shift(1))
        tr = tr1.combine(tr2, max).combine(tr3, max)
        return tr.rolling(window=window).mean()

    def compute_OBV(self, close, volume):
        """On Balance Volume — pressão compradora/vendedora."""
        obv = (np.sign(close.diff()) * volume).fillna(0).cumsum()
        return obv
