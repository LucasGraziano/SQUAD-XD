"""
Risk Manager — Gestao de Risco para Trading Bot

Regras:
- Nunca arriscar mais que X% do capital por trade (default: 2%)
- Stop Loss automatico: sai se perder X% (default: 3%)
- Take Profit automatico: sai se ganhar Y% (default: 6%) — ratio 1:2
- Trailing Stop: protege lucro movendo o stop conforme o preco sobe
- Position sizing: calcula quantidade baseada no risco maximo
- Persistencia: estado sobrevive restarts via JSON
"""

import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from app.state_store import (
    save_positions, load_positions,
    save_closed_positions, load_closed_positions,
    save_daily_state, load_daily_state
)

logger = logging.getLogger(__name__)


@dataclass
class RiskConfig:
    max_risk_per_trade: float = 0.02
    max_position_pct: float = 0.10       # Maximo 10% do capital por trade
    stop_loss_pct: float = 0.03
    take_profit_pct: float = 0.06
    trailing_stop_pct: float = 0.02
    max_open_positions: int = 3
    max_daily_trades: int = 10
    max_daily_loss_pct: float = 0.05


@dataclass
class Position:
    symbol: str
    side: str
    entry_price: float
    quantity: float
    stop_loss: float
    take_profit: float
    trailing_stop: float
    highest_price: float
    lowest_price: float
    opened_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    order_id: Optional[int] = None

    def to_dict(self) -> dict:
        return {
            "symbol": self.symbol, "side": self.side,
            "entry_price": self.entry_price, "quantity": self.quantity,
            "stop_loss": self.stop_loss, "take_profit": self.take_profit,
            "trailing_stop": self.trailing_stop,
            "highest_price": self.highest_price, "lowest_price": self.lowest_price,
            "opened_at": self.opened_at, "order_id": self.order_id
        }

    @classmethod
    def from_dict(cls, d: dict) -> "Position":
        return cls(**d)


class RiskManager:
    def __init__(self, config: Optional[RiskConfig] = None):
        self.config = config or RiskConfig()

        # Carregar estado persistido
        daily = load_daily_state()
        self.daily_trades: int = daily["daily_trades"]
        self.daily_pnl: float = daily["daily_pnl"]
        self.daily_date: str = daily["daily_date"]

        saved_positions = load_positions()
        self.positions: list[Position] = [Position.from_dict(p) for p in saved_positions]

        self.closed_positions: list[dict] = load_closed_positions()

        logger.info(
            f"RiskManager inicializado: {len(self.positions)} posicoes abertas, "
            f"{len(self.closed_positions)} fechadas, "
            f"daily_trades={self.daily_trades}, daily_pnl={self.daily_pnl}"
        )

    def _persist(self):
        """Salva estado atual em disco."""
        save_positions([p.to_dict() for p in self.positions])
        save_closed_positions(self.closed_positions)
        save_daily_state(self.daily_trades, self.daily_pnl, self.daily_date)

    def _reset_daily_if_needed(self):
        today = datetime.utcnow().strftime("%Y-%m-%d")
        if today != self.daily_date:
            self.daily_trades = 0
            self.daily_pnl = 0.0
            self.daily_date = today
            self._persist()

    def calculate_position_size(self, capital: float, entry_price: float) -> float:
        self._reset_daily_if_needed()
        max_risk_amount = capital * self.config.max_risk_per_trade
        risk_based_value = max_risk_amount / self.config.stop_loss_pct

        # Cap: nunca ultrapassar max_position_pct do capital (default 10%)
        max_allowed = capital * self.config.max_position_pct
        max_position_value = min(risk_based_value, max_allowed)

        quantity = max_position_value / entry_price

        logger.info(
            f"Position sizing: capital=${capital:.2f}, "
            f"risco_max=${max_risk_amount:.2f}, "
            f"posicao_max=${max_position_value:.2f} (cap {self.config.max_position_pct*100:.0f}%), "
            f"qty={quantity:.6f} @ ${entry_price:.2f}"
        )
        return quantity

    def can_trade(self, capital: float) -> dict:
        self._reset_daily_if_needed()
        checks = {"allowed": True, "reasons": []}

        if len(self.positions) >= self.config.max_open_positions:
            checks["allowed"] = False
            checks["reasons"].append(
                f"Maximo de {self.config.max_open_positions} posicoes abertas atingido"
            )

        if self.daily_trades >= self.config.max_daily_trades:
            checks["allowed"] = False
            checks["reasons"].append(
                f"Maximo de {self.config.max_daily_trades} trades diarios atingido"
            )

        max_daily_loss = capital * self.config.max_daily_loss_pct
        if self.daily_pnl < 0 and abs(self.daily_pnl) >= max_daily_loss:
            checks["allowed"] = False
            checks["reasons"].append(
                f"Perda diaria maxima atingida: ${abs(self.daily_pnl):.2f} >= ${max_daily_loss:.2f}"
            )

        if checks["allowed"]:
            checks["reasons"].append("Trade permitido")

        return checks

    def open_position(self, symbol: str, side: str, entry_price: float,
                      quantity: float, order_id: int = None) -> Position:

        if side == "BUY":
            stop_loss = entry_price * (1 - self.config.stop_loss_pct)
            take_profit = entry_price * (1 + self.config.take_profit_pct)
            trailing_stop = entry_price * (1 - self.config.trailing_stop_pct)
        else:
            stop_loss = entry_price * (1 + self.config.stop_loss_pct)
            take_profit = entry_price * (1 - self.config.take_profit_pct)
            trailing_stop = entry_price * (1 + self.config.trailing_stop_pct)

        position = Position(
            symbol=symbol, side=side,
            entry_price=entry_price, quantity=quantity,
            stop_loss=round(stop_loss, 2),
            take_profit=round(take_profit, 2),
            trailing_stop=round(trailing_stop, 2),
            highest_price=entry_price,
            lowest_price=entry_price,
            order_id=order_id
        )

        self.positions.append(position)
        self.daily_trades += 1
        self._persist()

        logger.info(
            f"Posicao aberta: {side} {quantity:.6f} {symbol} @ ${entry_price:.2f} | "
            f"SL: ${stop_loss:.2f} | TP: ${take_profit:.2f} | "
            f"Trailing: ${trailing_stop:.2f}"
        )
        return position

    def check_positions(self, current_prices: dict) -> list[dict]:
        actions = []

        for pos in self.positions[:]:
            price = current_prices.get(pos.symbol)
            if price is None:
                continue

            action = self._evaluate_position(pos, price)
            actions.append(action)

            if action["action"] != "HOLD":
                self._close_position(pos, price, action["reason"])

        return actions

    def _evaluate_position(self, pos: Position, current_price: float) -> dict:
        result = {
            "symbol": pos.symbol, "side": pos.side,
            "entry_price": pos.entry_price, "current_price": current_price,
            "quantity": pos.quantity,
            "action": "HOLD", "reason": ""
        }

        if pos.side == "BUY":
            if current_price > pos.highest_price:
                pos.highest_price = current_price
                pos.trailing_stop = round(
                    current_price * (1 - self.config.trailing_stop_pct), 2
                )

            pnl_pct = (current_price - pos.entry_price) / pos.entry_price

            if current_price >= pos.take_profit:
                result["action"] = "CLOSE_TP"
                result["reason"] = f"Take Profit: ${current_price:.2f} >= ${pos.take_profit:.2f} (+{pnl_pct*100:.1f}%)"
            elif current_price <= pos.stop_loss:
                result["action"] = "CLOSE_SL"
                result["reason"] = f"Stop Loss: ${current_price:.2f} <= ${pos.stop_loss:.2f} ({pnl_pct*100:.1f}%)"
            elif current_price <= pos.trailing_stop and current_price > pos.entry_price:
                result["action"] = "CLOSE_TRAILING"
                result["reason"] = f"Trailing Stop: ${current_price:.2f} <= ${pos.trailing_stop:.2f} (+{pnl_pct*100:.1f}%)"

        else:
            if current_price < pos.lowest_price:
                pos.lowest_price = current_price
                pos.trailing_stop = round(
                    current_price * (1 + self.config.trailing_stop_pct), 2
                )

            pnl_pct = (pos.entry_price - current_price) / pos.entry_price

            if current_price <= pos.take_profit:
                result["action"] = "CLOSE_TP"
                result["reason"] = f"Take Profit (short): ${current_price:.2f} <= ${pos.take_profit:.2f} (+{pnl_pct*100:.1f}%)"
            elif current_price >= pos.stop_loss:
                result["action"] = "CLOSE_SL"
                result["reason"] = f"Stop Loss (short): ${current_price:.2f} >= ${pos.stop_loss:.2f} ({pnl_pct*100:.1f}%)"
            elif current_price >= pos.trailing_stop and current_price < pos.entry_price:
                result["action"] = "CLOSE_TRAILING"
                result["reason"] = f"Trailing Stop (short): ${current_price:.2f} >= ${pos.trailing_stop:.2f} (+{pnl_pct*100:.1f}%)"

        result["pnl_pct"] = round(pnl_pct * 100, 2) if result["action"] != "HOLD" else round(
            ((current_price - pos.entry_price) / pos.entry_price) * 100, 2
        )

        return result

    def _close_position(self, pos: Position, close_price: float, reason: str):
        if pos.side == "BUY":
            pnl = (close_price - pos.entry_price) * pos.quantity
        else:
            pnl = (pos.entry_price - close_price) * pos.quantity

        closed = {
            "symbol": pos.symbol, "side": pos.side,
            "entry_price": pos.entry_price, "close_price": close_price,
            "quantity": pos.quantity,
            "pnl": round(pnl, 2),
            "pnl_pct": round(((close_price - pos.entry_price) / pos.entry_price) * 100, 2),
            "reason": reason,
            "opened_at": pos.opened_at,
            "closed_at": datetime.utcnow().isoformat(),
            "order_id": pos.order_id
        }

        self.closed_positions.append(closed)
        self.daily_pnl += pnl
        self.positions.remove(pos)
        self._persist()

        logger.info(f"Posicao fechada: {reason} | P&L: ${pnl:.2f}")
        return closed

    def get_status(self) -> dict:
        self._reset_daily_if_needed()
        return {
            "config": {
                "max_risk_per_trade": f"{self.config.max_risk_per_trade*100:.0f}%",
                "stop_loss": f"{self.config.stop_loss_pct*100:.0f}%",
                "take_profit": f"{self.config.take_profit_pct*100:.0f}%",
                "trailing_stop": f"{self.config.trailing_stop_pct*100:.0f}%",
                "risk_reward_ratio": f"1:{self.config.take_profit_pct/self.config.stop_loss_pct:.1f}",
                "max_open_positions": self.config.max_open_positions,
                "max_daily_trades": self.config.max_daily_trades,
                "max_daily_loss": f"{self.config.max_daily_loss_pct*100:.0f}%",
            },
            "open_positions": len(self.positions),
            "positions": [p.to_dict() for p in self.positions],
            "daily_trades": self.daily_trades,
            "daily_pnl": round(self.daily_pnl, 2),
            "total_closed": len(self.closed_positions),
            "closed_today": [
                c for c in self.closed_positions
                if c["closed_at"].startswith(self.daily_date)
            ]
        }
