from fastapi import FastAPI, HTTPException, Query
from binance.client import Client
from binance.enums import *
import httpx
import os
import logging
from datetime import datetime
from typing import Optional

from app.risk_manager import RiskManager, RiskConfig
from app.backtesting import BacktestEngine, BacktestConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Trading Bot Service", version="3.0")

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://ml-prediction-service:8000")
SENTIMENT_URL = os.getenv("SENTIMENT_URL", "http://sentiment-analysis-service:8000")
CRYPTO_FETCHER_URL = os.getenv("CRYPTO_FETCHER_URL", "http://crypto-fetcher-service:8000")

# Estado global (in-memory)
trade_history = []
risk_manager = RiskManager()


def get_client():
    api_key = os.getenv("BINANCE_API_KEY", "")
    secret = os.getenv("BINANCE_SECRET_KEY", "")
    testnet = os.getenv("BINANCE_TESTNET", "true").lower() == "true"
    return Client(api_key, secret, testnet=testnet)


# ==============================
# Health & Status
# ==============================

@app.get("/health")
def health():
    return {"status": "ok", "service": "trading-bot", "version": "3.0"}


@app.get("/trading/balance/")
def get_balance():
    """Saldo da conta Testnet."""
    try:
        client = get_client()
        account = client.get_account()
        balances = []
        for b in account['balances']:
            free = float(b['free'])
            locked = float(b['locked'])
            if free > 0 or locked > 0:
                balances.append({
                    "asset": b['asset'],
                    "free": free,
                    "locked": locked,
                    "total": free + locked
                })
        return {"balances": balances}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/trading/status/")
def status():
    """Status completo do bot."""
    total_trades = len(trade_history)
    buys = sum(1 for t in trade_history if t['side'] == 'BUY')
    sells = sum(1 for t in trade_history if t['side'] == 'SELL')

    pnl = 0
    for t in trade_history:
        if t['side'] == 'SELL':
            pnl += t['total_value']
        else:
            pnl -= t['total_value']

    return {
        "bot_active": True,
        "testnet": True,
        "version": "3.0",
        "total_trades": total_trades,
        "buys": buys,
        "sells": sells,
        "estimated_pnl_usdt": round(pnl, 2),
        "last_trade": trade_history[-1] if trade_history else None,
        "risk_manager": risk_manager.get_status()
    }


@app.get("/trading/history/")
def get_history():
    return {"trades": trade_history, "total": len(trade_history)}


# ==============================
# Risk Management
# ==============================

@app.get("/trading/risk/")
def get_risk_status():
    """Status do gerenciamento de risco."""
    return risk_manager.get_status()


@app.post("/trading/risk/config/")
def update_risk_config(
    stop_loss: Optional[float] = Query(None, description="Stop Loss % (ex: 0.03 = 3%)"),
    take_profit: Optional[float] = Query(None, description="Take Profit % (ex: 0.06 = 6%)"),
    risk_per_trade: Optional[float] = Query(None, description="Risco por trade % (ex: 0.02 = 2%)"),
    trailing_stop: Optional[float] = Query(None, description="Trailing Stop % (ex: 0.02 = 2%)"),
    max_positions: Optional[int] = Query(None, description="Max posicoes abertas"),
    max_daily_trades: Optional[int] = Query(None, description="Max trades por dia"),
    max_daily_loss: Optional[float] = Query(None, description="Max perda diaria % (ex: 0.05 = 5%)")
):
    """Atualiza configuração de risco."""
    cfg = risk_manager.config
    if stop_loss is not None:
        cfg.stop_loss_pct = stop_loss
    if take_profit is not None:
        cfg.take_profit_pct = take_profit
    if risk_per_trade is not None:
        cfg.max_risk_per_trade = risk_per_trade
    if trailing_stop is not None:
        cfg.trailing_stop_pct = trailing_stop
    if max_positions is not None:
        cfg.max_open_positions = max_positions
    if max_daily_trades is not None:
        cfg.max_daily_trades = max_daily_trades
    if max_daily_loss is not None:
        cfg.max_daily_loss_pct = max_daily_loss

    return {"message": "Config atualizada", "config": risk_manager.get_status()["config"]}


@app.post("/trading/risk/check-positions/")
async def check_open_positions():
    """Verifica posições abertas contra preços atuais (SL/TP/Trailing)."""
    if not risk_manager.positions:
        return {"message": "Nenhuma posicao aberta", "actions": []}

    # Buscar preços atuais
    current_prices = {}
    for pos in risk_manager.positions:
        try:
            client = get_client()
            ticker = client.get_symbol_ticker(symbol=pos.symbol)
            current_prices[pos.symbol] = float(ticker['price'])
        except Exception:
            pass

    actions = risk_manager.check_positions(current_prices)

    # Executar fechamentos
    for action in actions:
        if action["action"] != "HOLD":
            try:
                side = "SELL" if action["side"] == "BUY" else "BUY"
                # Na testnet, executar a ordem inversa
                _execute_order(action["symbol"], side, action.get("quantity", 0.001))
                logger.info(f"Auto-close: {action['reason']}")
            except Exception as e:
                logger.error(f"Erro ao fechar posicao: {e}")

    return {"actions": actions, "prices": current_prices}


# ==============================
# Trading Execution
# ==============================

@app.post("/trading/execute/")
def execute_trade(
    symbol: str = Query(..., description="Ex: BTCUSDT"),
    side: str = Query(..., description="BUY ou SELL"),
    quantity: float = Query(None, description="Quantidade (auto-calculada se vazio)"),
    use_risk_manager: bool = Query(True, description="Usar position sizing automatico")
):
    """Executa ordem com gestão de risco integrada."""
    try:
        client = get_client()

        # Position sizing automático
        if quantity is None or use_risk_manager:
            # Buscar saldo disponível
            account = client.get_account()
            usdt_balance = 0
            for b in account['balances']:
                if b['asset'] == 'USDT':
                    usdt_balance = float(b['free'])
                    break

            if usdt_balance <= 0:
                raise HTTPException(status_code=400, detail="Saldo USDT insuficiente")

            # Verificar se pode operar
            can_trade = risk_manager.can_trade(usdt_balance)
            if not can_trade["allowed"]:
                return {
                    "trade_executed": False,
                    "blocked": True,
                    "reasons": can_trade["reasons"]
                }

            # Buscar preço atual
            ticker = client.get_symbol_ticker(symbol=symbol.upper())
            current_price = float(ticker['price'])

            # Calcular quantidade via risk manager
            if quantity is None:
                quantity = risk_manager.calculate_position_size(usdt_balance, current_price)

                # Arredondar para a precisão do par
                if "BTC" in symbol:
                    quantity = round(quantity, 5)  # 0.00001 BTC min
                elif "ETH" in symbol:
                    quantity = round(quantity, 4)
                else:
                    quantity = round(quantity, 2)

        # Executar ordem
        order = client.create_order(
            symbol=symbol.upper(),
            side=SIDE_BUY if side.upper() == "BUY" else SIDE_SELL,
            type=ORDER_TYPE_MARKET,
            quantity=quantity
        )

        # Calcular valor total
        fills = order.get('fills', [])
        total_value = sum(float(f['price']) * float(f['qty']) for f in fills)
        avg_price = total_value / float(order['executedQty']) if float(order['executedQty']) > 0 else 0

        trade = {
            "timestamp": datetime.utcnow().isoformat(),
            "symbol": symbol.upper(),
            "side": side.upper(),
            "quantity": float(order['executedQty']),
            "avg_price": round(avg_price, 2),
            "total_value": round(total_value, 2),
            "order_id": order['orderId'],
            "status": order['status']
        }

        trade_history.append(trade)

        # Registrar no risk manager
        if side.upper() == "BUY":
            risk_manager.open_position(
                symbol=symbol.upper(),
                side="BUY",
                entry_price=avg_price,
                quantity=float(order['executedQty']),
                order_id=order['orderId']
            )

        logger.info(f"Trade executado: {trade}")
        return trade

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro na execucao: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


def _execute_order(symbol: str, side: str, quantity: float):
    """Helper interno para executar ordens."""
    client = get_client()
    return client.create_order(
        symbol=symbol,
        side=SIDE_BUY if side == "BUY" else SIDE_SELL,
        type=ORDER_TYPE_MARKET,
        quantity=quantity
    )


# ==============================
# Auto Trade (ML + Sentimento + Risco)
# ==============================

@app.post("/trading/auto/")
async def auto_trade(symbol: str = Query(...)):
    """Trade automático: ML + Sentimento + Gestão de Risco."""
    try:
        # 0. Verificar risco
        client = get_client()
        account = client.get_account()
        usdt_balance = 0
        for b in account['balances']:
            if b['asset'] == 'USDT':
                usdt_balance = float(b['free'])
                break

        can = risk_manager.can_trade(usdt_balance)
        if not can["allowed"]:
            return {
                "symbol": symbol,
                "decision": "BLOCKED",
                "reasoning": can["reasons"],
                "trade_executed": None
            }

        # 1. Pegar sinal ML
        async with httpx.AsyncClient(timeout=300) as http:
            ml_resp = await http.get(f"{ML_SERVICE_URL}/ml/predict/", params={"symbol": symbol})
            ml_data = ml_resp.json() if ml_resp.status_code == 200 else None

        # 2. Pegar sentimento
        async with httpx.AsyncClient(timeout=30) as http:
            sent_resp = await http.get(f"{SENTIMENT_URL}/sentiment/score/", params={"symbol": symbol})
            sent_data = sent_resp.json() if sent_resp.status_code == 200 else None

        # 3. Decidir
        ml_signal = ml_data.get("signal", "HOLD") if ml_data else "HOLD"
        ml_confidence = ml_data.get("confidence", 0) if ml_data else 0
        sentiment_score = sent_data.get("score", 0) if sent_data else 0
        sentiment_label = sent_data.get("sentiment", "NEUTRAL") if sent_data else "NEUTRAL"

        decision = "HOLD"
        reason = []

        if ml_signal == "BUY" and ml_confidence > 0.5:
            reason.append(f"ML sinaliza BUY (confianca: {ml_confidence}%)")
            if sentiment_score > -0.1:
                decision = "BUY"
                reason.append(f"Sentimento OK: {sentiment_label} ({sentiment_score})")
            else:
                reason.append(f"Sentimento BEARISH bloqueia compra ({sentiment_score})")

        elif ml_signal == "SELL":
            reason.append("ML sinaliza SELL")
            decision = "SELL"
            if sentiment_score < 0.1:
                reason.append(f"Sentimento confirma: {sentiment_label}")

        if not reason:
            reason.append("Sem sinal forte — HOLD")

        result = {
            "symbol": symbol,
            "decision": decision,
            "ml_signal": ml_signal,
            "ml_confidence": ml_confidence,
            "sentiment": sentiment_label,
            "sentiment_score": sentiment_score,
            "reasoning": reason,
            "trade_executed": None,
            "risk_check": can
        }

        # 4. Executar trade com position sizing
        if decision != "HOLD":
            try:
                ticker = client.get_symbol_ticker(symbol=symbol.upper())
                current_price = float(ticker['price'])

                qty = risk_manager.calculate_position_size(usdt_balance, current_price)
                if "BTC" in symbol:
                    qty = round(qty, 5)
                elif "ETH" in symbol:
                    qty = round(qty, 4)
                else:
                    qty = round(qty, 2)

                # Garantir quantidade mínima
                qty = max(qty, 0.00001)

                trade = execute_trade(symbol=symbol, side=decision, quantity=qty, use_risk_manager=False)
                result["trade_executed"] = trade
                result["position_size"] = {
                    "capital": usdt_balance,
                    "risk_amount": round(usdt_balance * risk_manager.config.max_risk_per_trade, 2),
                    "quantity": qty
                }
            except Exception as e:
                result["trade_error"] = str(e)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==============================
# Backtesting
# ==============================

@app.post("/trading/backtest/")
async def run_backtest(
    symbol: str = Query("BTCUSDT"),
    strategy: str = Query("ml_signal", description="ml_signal, rsi_mean_reversion, ema_crossover, smart_dca"),
    initial_capital: float = Query(10000),
    stop_loss: float = Query(0.03),
    take_profit: float = Query(0.06),
    risk_per_trade: float = Query(0.02)
):
    """Roda backtest em dados históricos."""
    try:
        # Buscar dados OHLCV
        async with httpx.AsyncClient(timeout=60) as http:
            resp = await http.get(
                f"{CRYPTO_FETCHER_URL}/crypto/ohlcv/",
                params={"symbol": symbol, "interval": "1d", "limit": 365}
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Erro ao buscar dados")
            ohlcv_data = resp.json()

        # Buscar sinais ML se estratégia usa ML
        signals = None
        if strategy == "ml_signal":
            try:
                async with httpx.AsyncClient(timeout=300) as http:
                    ml_resp = await http.get(
                        f"{ML_SERVICE_URL}/ml/train/",
                        params={"symbol": symbol}
                    )
                    if ml_resp.status_code == 200:
                        ml_result = ml_resp.json()
                        signals = ml_result.get("predictions", [])
            except Exception as e:
                logger.warning(f"ML indisponivel para backtest: {e}")

        # Rodar backtest
        config = BacktestConfig(
            initial_capital=initial_capital,
            stop_loss_pct=stop_loss,
            take_profit_pct=take_profit,
            risk_per_trade=risk_per_trade,
            strategy=strategy
        )

        engine = BacktestEngine(config)
        result = engine.run(ohlcv_data, signals)

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no backtest: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/trading/backtest/strategies/")
def list_strategies():
    """Lista estratégias disponíveis para backtest."""
    return {
        "strategies": [
            {
                "id": "ml_signal",
                "name": "ML Signal (Random Forest)",
                "description": "Segue sinais BUY/SELL do modelo ML com SL/TP automaticos",
                "best_for": "Tendencias claras com dados suficientes"
            },
            {
                "id": "rsi_mean_reversion",
                "name": "RSI Mean Reversion",
                "description": "Compra quando RSI < 30 (oversold), vende quando RSI > 70 (overbought)",
                "best_for": "Mercados laterais (range-bound)"
            },
            {
                "id": "ema_crossover",
                "name": "EMA Crossover (7/21)",
                "description": "Compra quando EMA rapida cruza acima da lenta, vende no cruzamento inverso",
                "best_for": "Mercados com tendencia definida"
            },
            {
                "id": "smart_dca",
                "name": "Smart DCA (Dollar Cost Averaging Inteligente)",
                "description": "Compra periodicamente, aumentando quando RSI esta baixo (comprar o medo)",
                "best_for": "Investimento de longo prazo, menor risco"
            }
        ]
    }
