"""
WebSocket Price Manager — Stream de precos real-time da Binance.

Usa Binance WebSocket para receber precos em tempo real
e redistribui para clientes conectados via WebSocket do FastAPI.
"""

import asyncio
import json
import logging
from typing import Optional
import httpx

logger = logging.getLogger(__name__)


class PriceManager:
    """Gerencia precos em tempo real e distribui para clientes WebSocket."""

    def __init__(self):
        self.prices: dict[str, float] = {}
        self.clients: list = []  # WebSocket connections
        self._running = False
        self._task: Optional[asyncio.Task] = None

    async def start_stream(self, symbols: list[str]):
        """Inicia polling de precos (compativel com Testnet que nao tem WS)."""
        if self._running:
            return

        self._running = True
        self._symbols = [s.lower() for s in symbols]

        # Binance Testnet nao suporta WebSocket streams de forma confiavel,
        # entao usamos polling rapido (a cada 5s) como alternativa robusta.
        self._task = asyncio.create_task(self._poll_prices())
        logger.info(f"Price stream iniciado para {symbols}")

    async def _poll_prices(self):
        """Polling rapido de precos via REST API."""
        from app.services import get_binance_client

        while self._running:
            try:
                client = get_binance_client()
                for symbol in self._symbols:
                    try:
                        ticker = client.get_symbol_ticker(symbol=symbol.upper())
                        price = float(ticker['price'])
                        self.prices[symbol.upper()] = price
                    except Exception as e:
                        logger.warning(f"Erro ao buscar preco de {symbol}: {e}")

                # Notificar clientes WebSocket
                await self._broadcast()

            except Exception as e:
                logger.error(f"Erro no price polling: {e}")

            await asyncio.sleep(5)  # 5 segundos entre polls

    async def _broadcast(self):
        """Envia precos atualizados para todos os clientes WS."""
        if not self.clients:
            return

        message = json.dumps({
            "type": "price_update",
            "prices": self.prices
        })

        disconnected = []
        for ws in self.clients:
            try:
                await ws.send_text(message)
            except Exception:
                disconnected.append(ws)

        for ws in disconnected:
            self.clients.remove(ws)

    def get_price(self, symbol: str) -> Optional[float]:
        return self.prices.get(symbol.upper())

    def get_all_prices(self) -> dict:
        return self.prices.copy()

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()


# Singleton
price_manager = PriceManager()
