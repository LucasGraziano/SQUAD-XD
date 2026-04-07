"""
Notifier — Envia alertas via Telegram quando trades sao executados.

Configuracao via env vars:
  TELEGRAM_BOT_TOKEN — token do bot (@BotFather)
  TELEGRAM_CHAT_ID — seu chat ID (@userinfobot)

Se nao configurado, loga e ignora silenciosamente.
"""

import os
import httpx
import logging

logger = logging.getLogger(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")


def _is_configured() -> bool:
    return bool(TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)


def _send_message(text: str):
    if not _is_configured():
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        with httpx.Client(timeout=10) as client:
            client.post(url, json={
                "chat_id": TELEGRAM_CHAT_ID,
                "text": text,
                "parse_mode": "HTML"
            })
    except Exception as e:
        logger.warning(f"Falha ao enviar Telegram: {e}")


def notify_trade(trade: dict):
    emoji = "🟢" if trade["side"] == "BUY" else "🔴"
    text = (
        f"{emoji} <b>Trade Executado</b>\n"
        f"Par: {trade['symbol']}\n"
        f"Lado: {trade['side']}\n"
        f"Quantidade: {trade['quantity']}\n"
        f"Preco: ${trade['avg_price']}\n"
        f"Total: ${trade['total_value']}\n"
        f"Order: #{trade['order_id']}"
    )
    _send_message(text)


def notify_alert(message: str):
    _send_message(f"⚠️ <b>Alerta CryptoBot</b>\n{message}")


def notify_daily_summary(performance: dict):
    text = (
        f"📊 <b>Resumo Diario</b>\n"
        f"Trades: {performance.get('daily_trades', 0)}\n"
        f"P&L: ${performance.get('daily_pnl', 0):.2f}\n"
        f"Win Rate: {performance.get('win_rate', 0)}%\n"
        f"Posicoes abertas: {performance.get('open_positions', 0)}"
    )
    _send_message(text)
