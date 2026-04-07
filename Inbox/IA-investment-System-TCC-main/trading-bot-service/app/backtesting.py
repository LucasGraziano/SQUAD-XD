"""
Backtesting Engine — Simula estratégias em dados históricos

Testa como sua estratégia teria performado no passado.
NÃO garante resultado futuro, mas se NEM no passado deu lucro, no futuro será pior.

Métricas calculadas:
- Total P&L, Win Rate, Average Win/Loss
- Max Drawdown (maior queda do pico)
- Sharpe Ratio (retorno ajustado ao risco)
- Risk/Reward Ratio real
- Profit Factor (lucro bruto / perda bruta)
"""

import numpy as np
import logging
from dataclasses import dataclass
from typing import Optional

logger = logging.getLogger(__name__)


@dataclass
class BacktestConfig:
    initial_capital: float = 10000.0
    stop_loss_pct: float = 0.03
    take_profit_pct: float = 0.06
    risk_per_trade: float = 0.02
    commission_pct: float = 0.001    # 0.1% Binance fee
    strategy: str = "ml_signal"      # ml_signal, rsi_mean_reversion, ema_crossover, smart_dca


@dataclass
class BacktestTrade:
    entry_date: str
    exit_date: str
    side: str
    entry_price: float
    exit_price: float
    quantity: float
    pnl: float
    pnl_pct: float
    exit_reason: str  # take_profit, stop_loss, signal_change, end_of_data


class BacktestEngine:
    def __init__(self, config: Optional[BacktestConfig] = None):
        self.config = config or BacktestConfig()

    def run(self, ohlcv_data: list[dict], signals: Optional[list[dict]] = None) -> dict:
        """
        Roda backtest nos dados históricos.

        ohlcv_data: lista de {date, open, high, low, close, volume}
        signals: lista opcional de {date, signal, confidence} do modelo ML
        """
        if len(ohlcv_data) < 20:
            return {"error": "Dados insuficientes (minimo 20 candles)"}

        strategy_fn = {
            "ml_signal": self._strategy_ml_signal,
            "rsi_mean_reversion": self._strategy_rsi,
            "ema_crossover": self._strategy_ema,
            "smart_dca": self._strategy_smart_dca,
        }.get(self.config.strategy, self._strategy_ml_signal)

        return strategy_fn(ohlcv_data, signals)

    # === Strategy: ML Signal ===

    def _strategy_ml_signal(self, data: list[dict], signals: list[dict] = None) -> dict:
        """Segue os sinais do modelo ML com SL/TP."""
        capital = self.config.initial_capital
        trades = []
        position = None
        equity_curve = [capital]

        signal_map = {}
        if signals:
            for s in signals:
                signal_map[s.get("date", "")] = s

        for i, candle in enumerate(data):
            date = candle["date"]
            close = candle["close"]
            high = candle["high"]
            low = candle["low"]

            sig = signal_map.get(date, {})
            ml_signal = sig.get("signal", sig.get("signal_ml", 0))
            if isinstance(ml_signal, str):
                ml_signal = 1 if ml_signal == "BUY" else -1 if ml_signal == "SELL" else 0

            # Se tem posição aberta, checar SL/TP
            if position:
                exit_price, exit_reason = self._check_exit(position, high, low, close)

                if exit_reason:
                    pnl = self._calc_pnl(position, exit_price)
                    capital += pnl
                    trades.append(BacktestTrade(
                        entry_date=position["date"],
                        exit_date=date,
                        side=position["side"],
                        entry_price=position["price"],
                        exit_price=exit_price,
                        quantity=position["qty"],
                        pnl=round(pnl, 2),
                        pnl_pct=round((pnl / (position["price"] * position["qty"])) * 100, 2),
                        exit_reason=exit_reason
                    ))
                    position = None

                # Trocar direção se sinal oposto
                elif (position["side"] == "BUY" and ml_signal == -1) or \
                     (position["side"] == "SELL" and ml_signal == 1):
                    pnl = self._calc_pnl(position, close)
                    capital += pnl
                    trades.append(BacktestTrade(
                        entry_date=position["date"],
                        exit_date=date,
                        side=position["side"],
                        entry_price=position["price"],
                        exit_price=close,
                        quantity=position["qty"],
                        pnl=round(pnl, 2),
                        pnl_pct=round((pnl / (position["price"] * position["qty"])) * 100, 2),
                        exit_reason="signal_change"
                    ))
                    position = None

            # Abrir nova posição
            if position is None and ml_signal != 0 and capital > 0:
                risk_amount = capital * self.config.risk_per_trade
                position_value = risk_amount / self.config.stop_loss_pct
                qty = min(position_value, capital * 0.95) / close  # nunca usar mais que 95%

                side = "BUY" if ml_signal == 1 else "SELL"
                if side == "BUY":
                    sl = close * (1 - self.config.stop_loss_pct)
                    tp = close * (1 + self.config.take_profit_pct)
                else:
                    sl = close * (1 + self.config.stop_loss_pct)
                    tp = close * (1 - self.config.take_profit_pct)

                commission = close * qty * self.config.commission_pct
                capital -= commission

                position = {
                    "date": date, "side": side, "price": close,
                    "qty": qty, "sl": sl, "tp": tp, "highest": close, "lowest": close
                }

            equity_curve.append(capital + (
                self._unrealized_pnl(position, close) if position else 0
            ))

        # Fechar posição aberta no final
        if position:
            close = data[-1]["close"]
            pnl = self._calc_pnl(position, close)
            capital += pnl
            trades.append(BacktestTrade(
                entry_date=position["date"],
                exit_date=data[-1]["date"],
                side=position["side"],
                entry_price=position["price"],
                exit_price=close,
                quantity=position["qty"],
                pnl=round(pnl, 2),
                pnl_pct=round((pnl / (position["price"] * position["qty"])) * 100, 2),
                exit_reason="end_of_data"
            ))

        return self._compile_results(trades, equity_curve, data)

    # === Strategy: RSI Mean Reversion ===

    def _strategy_rsi(self, data: list[dict], signals=None) -> dict:
        """Compra RSI < 30, vende RSI > 70."""
        capital = self.config.initial_capital
        trades = []
        position = None
        equity_curve = [capital]

        closes = [d["close"] for d in data]
        rsi_values = self._compute_rsi(closes)

        for i, candle in enumerate(data):
            close = candle["close"]
            high = candle["high"]
            low = candle["low"]
            rsi = rsi_values[i] if i < len(rsi_values) else 50

            if position:
                exit_price, exit_reason = self._check_exit(position, high, low, close)
                if exit_reason:
                    pnl = self._calc_pnl(position, exit_price)
                    capital += pnl
                    trades.append(BacktestTrade(
                        entry_date=position["date"], exit_date=candle["date"],
                        side=position["side"], entry_price=position["price"],
                        exit_price=exit_price, quantity=position["qty"],
                        pnl=round(pnl, 2),
                        pnl_pct=round((pnl / (position["price"] * position["qty"])) * 100, 2),
                        exit_reason=exit_reason
                    ))
                    position = None
                elif rsi > 70 and position["side"] == "BUY":
                    pnl = self._calc_pnl(position, close)
                    capital += pnl
                    trades.append(BacktestTrade(
                        entry_date=position["date"], exit_date=candle["date"],
                        side="BUY", entry_price=position["price"],
                        exit_price=close, quantity=position["qty"],
                        pnl=round(pnl, 2),
                        pnl_pct=round((pnl / (position["price"] * position["qty"])) * 100, 2),
                        exit_reason="rsi_overbought"
                    ))
                    position = None

            if position is None and rsi < 30 and capital > 0:
                risk_amount = capital * self.config.risk_per_trade
                position_value = risk_amount / self.config.stop_loss_pct
                qty = min(position_value, capital * 0.95) / close
                sl = close * (1 - self.config.stop_loss_pct)
                tp = close * (1 + self.config.take_profit_pct)
                commission = close * qty * self.config.commission_pct
                capital -= commission
                position = {
                    "date": candle["date"], "side": "BUY", "price": close,
                    "qty": qty, "sl": sl, "tp": tp, "highest": close, "lowest": close
                }

            equity_curve.append(capital + (
                self._unrealized_pnl(position, close) if position else 0
            ))

        if position:
            close = data[-1]["close"]
            pnl = self._calc_pnl(position, close)
            capital += pnl
            trades.append(BacktestTrade(
                entry_date=position["date"], exit_date=data[-1]["date"],
                side=position["side"], entry_price=position["price"],
                exit_price=close, quantity=position["qty"],
                pnl=round(pnl, 2),
                pnl_pct=round((pnl / (position["price"] * position["qty"])) * 100, 2),
                exit_reason="end_of_data"
            ))

        return self._compile_results(trades, equity_curve, data)

    # === Strategy: EMA Crossover ===

    def _strategy_ema(self, data: list[dict], signals=None) -> dict:
        """Compra quando EMA7 cruza acima da EMA21, vende quando cruza abaixo."""
        capital = self.config.initial_capital
        trades = []
        position = None
        equity_curve = [capital]

        closes = [d["close"] for d in data]
        ema7 = self._compute_ema(closes, 7)
        ema21 = self._compute_ema(closes, 21)

        for i, candle in enumerate(data):
            if i < 21:
                equity_curve.append(capital)
                continue

            close = candle["close"]
            high = candle["high"]
            low = candle["low"]

            cross_up = ema7[i] > ema21[i] and ema7[i-1] <= ema21[i-1]
            cross_down = ema7[i] < ema21[i] and ema7[i-1] >= ema21[i-1]

            if position:
                exit_price, exit_reason = self._check_exit(position, high, low, close)
                if exit_reason:
                    pnl = self._calc_pnl(position, exit_price)
                    capital += pnl
                    trades.append(BacktestTrade(
                        entry_date=position["date"], exit_date=candle["date"],
                        side=position["side"], entry_price=position["price"],
                        exit_price=exit_price, quantity=position["qty"],
                        pnl=round(pnl, 2),
                        pnl_pct=round((pnl / (position["price"] * position["qty"])) * 100, 2),
                        exit_reason=exit_reason
                    ))
                    position = None
                elif cross_down and position["side"] == "BUY":
                    pnl = self._calc_pnl(position, close)
                    capital += pnl
                    trades.append(BacktestTrade(
                        entry_date=position["date"], exit_date=candle["date"],
                        side="BUY", entry_price=position["price"],
                        exit_price=close, quantity=position["qty"],
                        pnl=round(pnl, 2),
                        pnl_pct=round((pnl / (position["price"] * position["qty"])) * 100, 2),
                        exit_reason="ema_cross_down"
                    ))
                    position = None

            if position is None and cross_up and capital > 0:
                risk_amount = capital * self.config.risk_per_trade
                position_value = risk_amount / self.config.stop_loss_pct
                qty = min(position_value, capital * 0.95) / close
                sl = close * (1 - self.config.stop_loss_pct)
                tp = close * (1 + self.config.take_profit_pct)
                commission = close * qty * self.config.commission_pct
                capital -= commission
                position = {
                    "date": candle["date"], "side": "BUY", "price": close,
                    "qty": qty, "sl": sl, "tp": tp, "highest": close, "lowest": close
                }

            equity_curve.append(capital + (
                self._unrealized_pnl(position, close) if position else 0
            ))

        if position:
            close = data[-1]["close"]
            pnl = self._calc_pnl(position, close)
            capital += pnl
            trades.append(BacktestTrade(
                entry_date=position["date"], exit_date=data[-1]["date"],
                side=position["side"], entry_price=position["price"],
                exit_price=close, quantity=position["qty"],
                pnl=round(pnl, 2),
                pnl_pct=round((pnl / (position["price"] * position["qty"])) * 100, 2),
                exit_reason="end_of_data"
            ))

        return self._compile_results(trades, equity_curve, data)

    # === Strategy: Smart DCA ===

    def _strategy_smart_dca(self, data: list[dict], signals=None) -> dict:
        """
        DCA Inteligente: compra periodicamente, mas aumenta quando RSI esta baixo.
        - RSI < 30: compra 3x o valor normal (desconto forte)
        - RSI 30-40: compra 2x (desconto moderado)
        - RSI 40-60: compra 1x (normal)
        - RSI > 60: pula (sobrecomprado)
        """
        capital = self.config.initial_capital
        invested = 0.0
        holdings = 0.0  # quantidade de crypto
        buys = []
        equity_curve = [capital]

        closes = [d["close"] for d in data]
        rsi_values = self._compute_rsi(closes)

        # Compra a cada 7 candles (semanal se dados diários)
        dca_interval = 7
        base_amount = capital * 0.02  # 2% do capital inicial por compra

        for i, candle in enumerate(data):
            close = candle["close"]
            rsi = rsi_values[i] if i < len(rsi_values) else 50

            if i % dca_interval == 0 and i > 14:
                # Multiplier baseado no RSI
                if rsi < 30:
                    multiplier = 3.0
                    reason = "RSI oversold — 3x"
                elif rsi < 40:
                    multiplier = 2.0
                    reason = "RSI low — 2x"
                elif rsi <= 60:
                    multiplier = 1.0
                    reason = "RSI normal — 1x"
                else:
                    multiplier = 0
                    reason = "RSI overbought — skip"

                buy_amount = base_amount * multiplier

                if buy_amount > 0 and capital >= buy_amount:
                    qty = buy_amount / close
                    commission = buy_amount * self.config.commission_pct
                    capital -= (buy_amount + commission)
                    invested += buy_amount
                    holdings += qty

                    buys.append({
                        "date": candle["date"],
                        "price": close,
                        "amount": round(buy_amount, 2),
                        "quantity": round(qty, 8),
                        "rsi": round(rsi, 1),
                        "multiplier": multiplier,
                        "reason": reason
                    })

            # Equity = cash + holdings value
            equity_curve.append(capital + (holdings * close))

        # Resultado final
        final_price = data[-1]["close"]
        holdings_value = holdings * final_price
        total_equity = capital + holdings_value
        total_pnl = total_equity - self.config.initial_capital
        avg_buy_price = invested / holdings if holdings > 0 else 0

        return {
            "strategy": "smart_dca",
            "period": f"{data[0]['date']} — {data[-1]['date']}",
            "initial_capital": self.config.initial_capital,
            "final_equity": round(total_equity, 2),
            "total_pnl": round(total_pnl, 2),
            "total_pnl_pct": round((total_pnl / self.config.initial_capital) * 100, 2),
            "total_invested": round(invested, 2),
            "cash_remaining": round(capital, 2),
            "holdings": round(holdings, 8),
            "holdings_value": round(holdings_value, 2),
            "avg_buy_price": round(avg_buy_price, 2),
            "current_price": final_price,
            "unrealized_pnl_pct": round(((final_price - avg_buy_price) / avg_buy_price * 100), 2) if avg_buy_price > 0 else 0,
            "total_buys": len(buys),
            "buys": buys[-20:],  # últimas 20 compras
            "equity_curve": equity_curve[::max(1, len(equity_curve)//100)],  # 100 pontos
            "max_drawdown": round(self._max_drawdown(equity_curve) * 100, 2)
        }

    # === Helper Methods ===

    def _check_exit(self, pos: dict, high: float, low: float, close: float):
        """Verifica se SL ou TP foi atingido no candle."""
        if pos["side"] == "BUY":
            if high > pos.get("highest", pos["price"]):
                pos["highest"] = high
            if low <= pos["sl"]:
                return pos["sl"], "stop_loss"
            if high >= pos["tp"]:
                return pos["tp"], "take_profit"
        else:
            if low < pos.get("lowest", pos["price"]):
                pos["lowest"] = low
            if high >= pos["sl"]:
                return pos["sl"], "stop_loss"
            if low <= pos["tp"]:
                return pos["tp"], "take_profit"
        return None, None

    def _calc_pnl(self, pos: dict, exit_price: float) -> float:
        if pos["side"] == "BUY":
            gross = (exit_price - pos["price"]) * pos["qty"]
        else:
            gross = (pos["price"] - exit_price) * pos["qty"]
        commission = exit_price * pos["qty"] * self.config.commission_pct
        return gross - commission

    def _unrealized_pnl(self, pos: dict, current_price: float) -> float:
        if pos is None:
            return 0
        if pos["side"] == "BUY":
            return (current_price - pos["price"]) * pos["qty"]
        return (pos["price"] - current_price) * pos["qty"]

    def _max_drawdown(self, equity_curve: list) -> float:
        if not equity_curve:
            return 0
        peak = equity_curve[0]
        max_dd = 0
        for val in equity_curve:
            if val > peak:
                peak = val
            dd = (peak - val) / peak if peak > 0 else 0
            max_dd = max(max_dd, dd)
        return max_dd

    def _compute_rsi(self, closes: list, window: int = 14) -> list:
        """RSI com Wilder's Smoothing (EMA) — padrao da industria."""
        rsi = [50.0] * window
        if len(closes) < window + 1:
            return rsi + [50.0] * (len(closes) - window)

        # Calcular ganhos e perdas
        deltas = [closes[i] - closes[i-1] for i in range(1, len(closes))]
        gains = [max(d, 0) for d in deltas]
        losses_list = [max(-d, 0) for d in deltas]

        # Primeira media (SMA)
        avg_gain = sum(gains[:window]) / window
        avg_loss = sum(losses_list[:window]) / window

        if avg_loss == 0:
            rsi.append(100.0)
        else:
            rs = avg_gain / avg_loss
            rsi.append(100 - (100 / (1 + rs)))

        # Wilder's smoothing (EMA com alpha = 1/window)
        for i in range(window, len(deltas)):
            avg_gain = (avg_gain * (window - 1) + gains[i]) / window
            avg_loss = (avg_loss * (window - 1) + losses_list[i]) / window

            if avg_loss == 0:
                rsi.append(100.0)
            else:
                rs = avg_gain / avg_loss
                rsi.append(100 - (100 / (1 + rs)))

        return rsi

    def _compute_ema(self, closes: list, window: int) -> list:
        ema = [closes[0]]
        multiplier = 2 / (window + 1)
        for i in range(1, len(closes)):
            ema.append(closes[i] * multiplier + ema[-1] * (1 - multiplier))
        return ema

    # === Compile Results ===

    def _compile_results(self, trades: list[BacktestTrade], equity_curve: list,
                         data: list[dict]) -> dict:
        if not trades:
            return {
                "strategy": self.config.strategy,
                "error": "Nenhum trade executado — sinal insuficiente nos dados"
            }

        wins = [t for t in trades if t.pnl > 0]
        losses = [t for t in trades if t.pnl <= 0]

        total_pnl = sum(t.pnl for t in trades)
        gross_profit = sum(t.pnl for t in wins) if wins else 0
        gross_loss = abs(sum(t.pnl for t in losses)) if losses else 0

        avg_win = np.mean([t.pnl for t in wins]) if wins else 0
        avg_loss = np.mean([abs(t.pnl) for t in losses]) if losses else 0

        # Sharpe Ratio (anualizado, assumindo ~252 dias)
        returns = [t.pnl_pct / 100 for t in trades]
        sharpe = (np.mean(returns) / np.std(returns) * np.sqrt(252)) if np.std(returns) > 0 else 0

        max_dd = self._max_drawdown(equity_curve)

        # Exit reasons breakdown
        exit_reasons = {}
        for t in trades:
            exit_reasons[t.exit_reason] = exit_reasons.get(t.exit_reason, 0) + 1

        return {
            "strategy": self.config.strategy,
            "period": f"{data[0]['date']} — {data[-1]['date']}",
            "initial_capital": self.config.initial_capital,
            "final_capital": round(self.config.initial_capital + total_pnl, 2),
            "total_pnl": round(total_pnl, 2),
            "total_pnl_pct": round((total_pnl / self.config.initial_capital) * 100, 2),
            "total_trades": len(trades),
            "winning_trades": len(wins),
            "losing_trades": len(losses),
            "win_rate": round(len(wins) / len(trades) * 100, 1),
            "avg_win": round(avg_win, 2),
            "avg_loss": round(avg_loss, 2),
            "risk_reward_ratio": round(avg_win / avg_loss, 2) if avg_loss > 0 else 0,
            "profit_factor": round(gross_profit / gross_loss, 2) if gross_loss > 0 else float('inf'),
            "max_drawdown": round(max_dd * 100, 2),
            "sharpe_ratio": round(sharpe, 2),
            "exit_reasons": exit_reasons,
            "best_trade": round(max(t.pnl for t in trades), 2),
            "worst_trade": round(min(t.pnl for t in trades), 2),
            "config": {
                "stop_loss": f"{self.config.stop_loss_pct*100:.0f}%",
                "take_profit": f"{self.config.take_profit_pct*100:.0f}%",
                "risk_per_trade": f"{self.config.risk_per_trade*100:.0f}%",
                "commission": f"{self.config.commission_pct*100:.1f}%"
            },
            "trades": [
                {
                    "entry_date": t.entry_date,
                    "exit_date": t.exit_date,
                    "side": t.side,
                    "entry_price": t.entry_price,
                    "exit_price": t.exit_price,
                    "pnl": t.pnl,
                    "pnl_pct": t.pnl_pct,
                    "exit_reason": t.exit_reason
                }
                for t in trades[-50:]  # últimos 50 trades
            ],
            "equity_curve": equity_curve[::max(1, len(equity_curve)//100)]  # 100 pontos
        }
