"""
State Store — Persistencia de estado em JSON para sobreviver restarts.

Salva: trades, posicoes abertas, posicoes fechadas, contadores diarios.
Carrega automaticamente na inicializacao.
"""

import json
import os
import logging
from datetime import datetime
from typing import Any

logger = logging.getLogger(__name__)

STATE_DIR = os.getenv("STATE_DIR", "/tmp/trading-state")
os.makedirs(STATE_DIR, exist_ok=True)


def _path(filename: str) -> str:
    return os.path.join(STATE_DIR, filename)


def save_json(filename: str, data: Any):
    path = _path(filename)
    try:
        with open(path, 'w') as f:
            json.dump(data, f, indent=2, default=str)
    except Exception as e:
        logger.error(f"Erro ao salvar {filename}: {e}")


def load_json(filename: str, default: Any = None) -> Any:
    path = _path(filename)
    if not os.path.exists(path):
        return default
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Erro ao carregar {filename}: {e}")
        return default


def save_trade_history(trades: list):
    save_json("trade_history.json", trades)


def load_trade_history() -> list:
    return load_json("trade_history.json", [])


def save_positions(positions: list[dict]):
    save_json("open_positions.json", positions)


def load_positions() -> list[dict]:
    return load_json("open_positions.json", [])


def save_closed_positions(closed: list[dict]):
    save_json("closed_positions.json", closed)


def load_closed_positions() -> list[dict]:
    return load_json("closed_positions.json", [])


def save_daily_state(daily_trades: int, daily_pnl: float, daily_date: str):
    save_json("daily_state.json", {
        "daily_trades": daily_trades,
        "daily_pnl": daily_pnl,
        "daily_date": daily_date
    })


def load_daily_state() -> dict:
    return load_json("daily_state.json", {
        "daily_trades": 0,
        "daily_pnl": 0.0,
        "daily_date": datetime.utcnow().strftime("%Y-%m-%d")
    })
