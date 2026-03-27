"""
Risk Manager — Gestão de Risco para Trading Bot

Regras:
- Nunca arriscar mais que X% do capital por trade (default: 2%)
- Stop Loss automático: sai se perder X% (default: 3%)
- Take Profit automático: sai se ganhar Y% (default: 6%) — ratio 1:2
- Trailing Stop: protege lucro movendo o stop conforme o preço sobe
- Position sizing: calcula quantidade baseada no risco máximo
"""

import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)


@dataclass
class RiskConfig:
    """Configuração de risco — ajustável pelo usuário."""
    max_risk_per_trade: float = 0.02      # 2% do capital por trade
    stop_loss_pct: float = 0.03           # 3% de stop loss
    take_profit_pct: float = 0.06         # 6% de take profit (ratio 1:2)
    trailing_stop_pct: float = 0.02       # 2% trailing stop
    max_open_positions: int = 3           # máximo de posições abertas
    max_daily_trades: int = 10            # máximo de trades por dia
    max_daily_loss_pct: float = 0.05      # para de operar se perder 5% no dia


@dataclass
class Position:
    """Posição aberta com tracking de SL/TP."""
    symbol: str
    side: str                             # BUY ou SELL
    entry_price: float
    quantity: float
    stop_loss: float
    take_profit: float
    trailing_stop: float
    highest_price: float                  # para trailing stop
    lowest_price: float                   # para trailing stop (short)
    opened_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    order_id: Optional[int] = None


class RiskManager:
    def __init__(self, config: Optional[RiskConfig] = None):
        self.config = config or RiskConfig()
        self.positions: list[Position] = []
        self.daily_trades: int = 0
        self.daily_pnl: float = 0.0
        self.daily_date: str = datetime.utcnow().strftime("%Y-%m-%d")
        self.closed_positions: list[dict] = []

    def _reset_daily_if_needed(self):
        today = datetime.utcnow().strftime("%Y-%m-%d")
        if today != self.daily_date:
            self.daily_trades = 0
            self.daily_pnl = 0.0
            self.daily_date = today

    # === Position Sizing ===

    def calculate_position_size(self, capital: float, entry_price: float) -> float:
        """
        Calcula a quantidade máxima para comprar baseado na regra de risco.

        Se capital = $10.000, risco = 2%, stop = 3%:
        - Risco máximo = $10.000 * 0.02 = $200
        - Se stop loss = 3%, significa que podemos perder 3% do valor da posição
        - Tamanho máximo da posição = $200 / 0.03 = $6.666
        - Quantidade = $6.666 / preço_atual
        """
        self._reset_daily_if_needed()

        max_risk_amount = capital * self.config.max_risk_per_trade
        max_position_value = max_risk_amount / self.config.stop_loss_pct
        quantity = max_position_value / entry_price

        logger.info(
            f"Position sizing: capital=${capital:.2f}, "
            f"risco_max=${max_risk_amount:.2f}, "
            f"posicao_max=${max_position_value:.2f}, "
            f"qty={quantity:.6f} @ ${entry_price:.2f}"
        )

        return quantity

    # === Trade Validation ===

    def can_trade(self, capital: float) -> dict:
        """Verifica se é permitido abrir novo trade."""
        self._reset_daily_if_needed()

        checks = {
            "allowed": True,
            "reasons": []
        }

        # Check: máximo de posições abertas
        if len(self.positions) >= self.config.max_open_positions:
            checks["allowed"] = False
            checks["reasons"].append(
                f"Maximo de {self.config.max_open_positions} posicoes abertas atingido"
            )

        # Check: máximo de trades diários
        if self.daily_trades >= self.config.max_daily_trades:
            checks["allowed"] = False
            checks["reasons"].append(
                f"Maximo de {self.config.max_daily_trades} trades diarios atingido"
            )

        # Check: perda diária máxima
        max_daily_loss = capital * self.config.max_daily_loss_pct
        if self.daily_pnl < 0 and abs(self.daily_pnl) >= max_daily_loss:
            checks["allowed"] = False
            checks["reasons"].append(
                f"Perda diaria maxima atingida: ${abs(self.daily_pnl):.2f} >= ${max_daily_loss:.2f}"
            )

        if checks["allowed"]:
            checks["reasons"].append("Trade permitido")

        return checks

    # === Open Position ===

    def open_position(self, symbol: str, side: str, entry_price: float,
                      quantity: float, order_id: int = None) -> Position:
        """Abre posição com SL/TP automáticos."""

        if side == "BUY":
            stop_loss = entry_price * (1 - self.config.stop_loss_pct)
            take_profit = entry_price * (1 + self.config.take_profit_pct)
            trailing_stop = entry_price * (1 - self.config.trailing_stop_pct)
        else:  # SELL (short)
            stop_loss = entry_price * (1 + self.config.stop_loss_pct)
            take_profit = entry_price * (1 - self.config.take_profit_pct)
            trailing_stop = entry_price * (1 + self.config.trailing_stop_pct)

        position = Position(
            symbol=symbol,
            side=side,
            entry_price=entry_price,
            quantity=quantity,
            stop_loss=round(stop_loss, 2),
            take_profit=round(take_profit, 2),
            trailing_stop=round(trailing_stop, 2),
            highest_price=entry_price,
            lowest_price=entry_price,
            order_id=order_id
        )

        self.positions.append(position)
        self.daily_trades += 1

        logger.info(
            f"Posicao aberta: {side} {quantity:.6f} {symbol} @ ${entry_price:.2f} | "
            f"SL: ${stop_loss:.2f} | TP: ${take_profit:.2f} | "
            f"Trailing: ${trailing_stop:.2f}"
        )

        return position

    # === Check Positions (executar periodicamente) ===

    def check_positions(self, current_prices: dict) -> list[dict]:
        """
        Verifica todas as posições abertas contra preços atuais.
        Retorna lista de ações a tomar (CLOSE_SL, CLOSE_TP, CLOSE_TRAILING, HOLD).
        """
        actions = []

        for pos in self.positions[:]:  # cópia para poder remover
            price = current_prices.get(pos.symbol)
            if price is None:
                continue

            action = self._evaluate_position(pos, price)
            actions.append(action)

            if action["action"] != "HOLD":
                self._close_position(pos, price, action["reason"])

        return actions

    def _evaluate_position(self, pos: Position, current_price: float) -> dict:
        """Avalia uma posição contra o preço atual."""

        result = {
            "symbol": pos.symbol,
            "side": pos.side,
            "entry_price": pos.entry_price,
            "current_price": current_price,
            "action": "HOLD",
            "reason": ""
        }

        if pos.side == "BUY":
            # Atualizar highest price para trailing stop
            if current_price > pos.highest_price:
                pos.highest_price = current_price
                pos.trailing_stop = round(
                    current_price * (1 - self.config.trailing_stop_pct), 2
                )

            pnl_pct = (current_price - pos.entry_price) / pos.entry_price

            # Check Take Profit
            if current_price >= pos.take_profit:
                result["action"] = "CLOSE_TP"
                result["reason"] = f"Take Profit atingido: ${current_price:.2f} >= ${pos.take_profit:.2f} (+{pnl_pct*100:.1f}%)"

            # Check Stop Loss
            elif current_price <= pos.stop_loss:
                result["action"] = "CLOSE_SL"
                result["reason"] = f"Stop Loss atingido: ${current_price:.2f} <= ${pos.stop_loss:.2f} ({pnl_pct*100:.1f}%)"

            # Check Trailing Stop (só ativa se estiver no lucro)
            elif current_price <= pos.trailing_stop and current_price > pos.entry_price:
                result["action"] = "CLOSE_TRAILING"
                result["reason"] = f"Trailing Stop atingido: ${current_price:.2f} <= ${pos.trailing_stop:.2f} (+{pnl_pct*100:.1f}%)"

        else:  # SELL (short)
            if current_price < pos.lowest_price:
                pos.lowest_price = current_price
                pos.trailing_stop = round(
                    current_price * (1 + self.config.trailing_stop_pct), 2
                )

            pnl_pct = (pos.entry_price - current_price) / pos.entry_price

            if current_price <= pos.take_profit:
                result["action"] = "CLOSE_TP"
                result["reason"] = f"Take Profit atingido (short): ${current_price:.2f} <= ${pos.take_profit:.2f} (+{pnl_pct*100:.1f}%)"

            elif current_price >= pos.stop_loss:
                result["action"] = "CLOSE_SL"
                result["reason"] = f"Stop Loss atingido (short): ${current_price:.2f} >= ${pos.stop_loss:.2f} ({pnl_pct*100:.1f}%)"

            elif current_price >= pos.trailing_stop and current_price < pos.entry_price:
                result["action"] = "CLOSE_TRAILING"
                result["reason"] = f"Trailing Stop atingido (short): ${current_price:.2f} >= ${pos.trailing_stop:.2f} (+{pnl_pct*100:.1f}%)"

        result["pnl_pct"] = round(pnl_pct * 100, 2) if result["action"] != "HOLD" else round(
            ((current_price - pos.entry_price) / pos.entry_price) * 100, 2
        )

        return result

    def _close_position(self, pos: Position, close_price: float, reason: str):
        """Fecha posição e registra no histórico."""
        if pos.side == "BUY":
            pnl = (close_price - pos.entry_price) * pos.quantity
        else:
            pnl = (pos.entry_price - close_price) * pos.quantity

        closed = {
            "symbol": pos.symbol,
            "side": pos.side,
            "entry_price": pos.entry_price,
            "close_price": close_price,
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

        logger.info(f"Posicao fechada: {reason} | P&L: ${pnl:.2f}")

        return closed

    # === Status ===

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
            "positions": [
                {
                    "symbol": p.symbol,
                    "side": p.side,
                    "entry_price": p.entry_price,
                    "quantity": p.quantity,
                    "stop_loss": p.stop_loss,
                    "take_profit": p.take_profit,
                    "trailing_stop": p.trailing_stop,
                    "opened_at": p.opened_at
                }
                for p in self.positions
            ],
            "daily_trades": self.daily_trades,
            "daily_pnl": round(self.daily_pnl, 2),
            "closed_today": [
                c for c in self.closed_positions
                if c["closed_at"].startswith(self.daily_date)
            ]
        }
