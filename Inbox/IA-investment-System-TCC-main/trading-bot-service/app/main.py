from fastapi import FastAPI, HTTPException, Query
from binance.client import Client
from binance.enums import *
import httpx
import os
import logging
from datetime import datetime
from typing import Optional
from apscheduler.schedulers.background import BackgroundScheduler

from app.risk_manager import RiskManager, RiskConfig
from app.backtesting import BacktestEngine, BacktestConfig
from app.state_store import save_trade_history, load_trade_history
from app.notifier import notify_trade, notify_alert

logging.basicConfig(
    level=logging.INFO,
    format='{"time":"%(asctime)s","level":"%(levelname)s","module":"%(name)s","msg":"%(message)s"}'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Trading Bot Service", version="4.0")

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://ml-prediction-service:8000")
SENTIMENT_URL = os.getenv("SENTIMENT_URL", "http://sentiment-analysis-service:8000")
CRYPTO_FETCHER_URL = os.getenv("CRYPTO_FETCHER_URL", "http://crypto-fetcher-service:8000")

# Estado com persistencia
trade_history = load_trade_history()
risk_manager = RiskManager()

# Singleton Binance client
_binance_client: Optional[Client] = None


def get_client() -> Client:
    global _binance_client
    if _binance_client is None:
        api_key = os.getenv("BINANCE_API_KEY", "")
        secret = os.getenv("BINANCE_SECRET_KEY", "")
        testnet = os.getenv("BINANCE_TESTNET", "true").lower() == "true"
        _binance_client = Client(api_key, secret, testnet=testnet)
        # Sincronizar relogio com servidor Binance (evita erro -1021)
        import time
        server_time = _binance_client.get_server_time()['serverTime']
        _binance_client.timestamp_offset = server_time - int(time.time() * 1000)
        logger.info(f"Binance client criado (testnet={testnet}, offset={_binance_client.timestamp_offset}ms)")
    return _binance_client


# ==============================
# Scheduler — Check positions automatico
# ==============================

scheduler = BackgroundScheduler()


def scheduled_check_positions():
    """Verifica SL/TP/Trailing a cada 30 segundos."""
    if not risk_manager.positions:
        return

    client = get_client()
    current_prices = {}

    for pos in risk_manager.positions:
        try:
            ticker = client.get_symbol_ticker(symbol=pos.symbol)
            current_prices[pos.symbol] = float(ticker['price'])
        except Exception as e:
            logger.error(f"Erro ao buscar preco de {pos.symbol}: {e}")

    if not current_prices:
        return

    actions = risk_manager.check_positions(current_prices)

    for action in actions:
        if action["action"] != "HOLD":
            try:
                side = "SELL" if action["side"] == "BUY" else "BUY"
                qty = action.get("quantity", 0.001)
                _execute_order(action["symbol"], side, qty)
                logger.info(f"Auto-close: {action['reason']}")
                notify_alert(
                    f"Posicao fechada automaticamente\n"
                    f"{action['symbol']} | {action['reason']}\n"
                    f"P&L: {action.get('pnl_pct', 0)}%"
                )
            except Exception as e:
                logger.error(f"Erro ao fechar posicao: {e}")


scheduler.add_job(scheduled_check_positions, 'interval', seconds=30, id='check_positions')

# Estado do auto-trading
_auto_trading_enabled = False
_auto_trading_symbols = ["BTCUSDT"]
_auto_trading_interval = 300  # 5 minutos
_decision_log = []  # ultimas decisoes do auto-trade


def scheduled_auto_trade():
    """Executa analise e trade automatico periodicamente."""
    if not _auto_trading_enabled:
        return

    import asyncio

    for symbol in _auto_trading_symbols:
        try:
            loop = asyncio.new_event_loop()
            result = loop.run_until_complete(_run_auto_trade(symbol))
            loop.close()

            decision = result.get("decision", "HOLD")
            result["timestamp"] = datetime.utcnow().isoformat()
            _decision_log.insert(0, result)
            if len(_decision_log) > 50:
                _decision_log.pop()

            if decision != "HOLD":
                logger.info(
                    f"[AUTO] {symbol}: {decision} | "
                    f"ML={result.get('ml_signal')} Sent={result.get('sentiment')} | "
                    f"Trade={'OK' if result.get('trade_executed') else 'FALHOU'}"
                )
            else:
                logger.info(f"[AUTO] {symbol}: HOLD — sem sinal forte")
        except Exception as e:
            logger.error(f"[AUTO] Erro em {symbol}: {e}")


async def _run_auto_trade(symbol: str) -> dict:
    """Logica do auto-trade (reutiliza mesma logica do endpoint)."""
    client = get_client()
    account = client.get_account()
    usdt_balance = 0
    for b in account['balances']:
        if b['asset'] == 'USDT':
            usdt_balance = float(b['free'])
            break

    can = risk_manager.can_trade(usdt_balance)
    if not can["allowed"]:
        return {"symbol": symbol, "decision": "BLOCKED", "reasoning": can["reasons"]}

    ml_data = await http_get_with_retry(
        f"{ML_SERVICE_URL}/ml/predict/", params={"symbol": symbol}, timeout=300
    )
    sent_data = await http_get_with_retry(
        f"{SENTIMENT_URL}/sentiment/score/", params={"symbol": symbol}, timeout=30
    )

    ml_signal = ml_data.get("signal", "HOLD") if ml_data else "HOLD"
    ml_confidence = ml_data.get("confidence", 0) if ml_data else 0
    sentiment_score = sent_data.get("score", 0) if sent_data else 0
    sentiment_label = sent_data.get("sentiment", "NEUTRAL") if sent_data else "NEUTRAL"

    decision = "HOLD"
    if ml_signal == "BUY" and ml_confidence > 0.5 and sentiment_score > -0.1:
        decision = "BUY"
    elif ml_signal == "SELL" and sentiment_score < 0.1:
        decision = "SELL"

    result = {
        "symbol": symbol, "decision": decision,
        "ml_signal": ml_signal, "ml_confidence": ml_confidence,
        "sentiment": sentiment_label, "sentiment_score": sentiment_score,
        "trade_executed": None
    }

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
            qty = max(qty, 0.00001)

            trade = execute_trade(symbol=symbol, side=decision, quantity=qty, use_risk_manager=False)
            result["trade_executed"] = trade

            notify_trade(symbol, decision, qty, current_price)
        except Exception as e:
            result["trade_error"] = str(e)

    return result


scheduler.add_job(scheduled_auto_trade, 'interval', seconds=_auto_trading_interval, id='auto_trade')
scheduler.start()
logger.info("Schedulers iniciados: check-positions (30s), auto-trade (5min, desativado por default)")


# ==============================
# HTTP client com retry
# ==============================

async def http_get_with_retry(url: str, params: dict = None, timeout: int = 60, retries: int = 3) -> dict:
    for attempt in range(retries):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                resp = await client.get(url, params=params)
                if resp.status_code == 200:
                    return resp.json()
                logger.warning(f"HTTP {resp.status_code} de {url} (tentativa {attempt+1})")
        except (httpx.ReadTimeout, httpx.ConnectTimeout) as e:
            logger.warning(f"Timeout em {url} (tentativa {attempt+1}): {e}")
        except httpx.ConnectError as e:
            logger.warning(f"Conexao falhou para {url} (tentativa {attempt+1}): {e}")

        if attempt < retries - 1:
            import asyncio
            await asyncio.sleep(2 ** attempt)  # backoff: 1s, 2s, 4s

    return None


async def http_post_with_retry(url: str, params: dict = None, timeout: int = 60, retries: int = 3) -> dict:
    for attempt in range(retries):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                resp = await client.post(url, params=params)
                if resp.status_code == 200:
                    return resp.json()
                logger.warning(f"HTTP {resp.status_code} de {url} (tentativa {attempt+1})")
        except (httpx.ReadTimeout, httpx.ConnectTimeout, httpx.ConnectError) as e:
            logger.warning(f"Erro em {url} (tentativa {attempt+1}): {e}")

        if attempt < retries - 1:
            import asyncio
            await asyncio.sleep(2 ** attempt)

    return None


# ==============================
# Health & Status
# ==============================

@app.get("/health")
def health():
    return {
        "status": "ok", "service": "trading-bot", "version": "4.0",
        "open_positions": len(risk_manager.positions),
        "scheduler_active": scheduler.running
    }


@app.post("/trading/auto-mode/")
def toggle_auto_mode(
    enabled: bool = Query(..., description="true para ligar, false para desligar"),
    interval: int = Query(300, description="Intervalo em segundos (default 5min)"),
    symbols: str = Query("BTCUSDT", description="Pares separados por virgula")
):
    """Liga/desliga o modo automatico de trading."""
    global _auto_trading_enabled, _auto_trading_symbols, _auto_trading_interval

    _auto_trading_enabled = enabled
    _auto_trading_symbols = [s.strip().upper() for s in symbols.split(",")]
    _auto_trading_interval = max(60, interval)  # minimo 1 minuto

    # Atualizar intervalo do job
    scheduler.reschedule_job('auto_trade', trigger='interval', seconds=_auto_trading_interval)

    status = "ATIVADO" if enabled else "DESATIVADO"
    logger.info(f"Auto-trading {status}: symbols={_auto_trading_symbols}, interval={_auto_trading_interval}s")

    return {
        "auto_trading": enabled,
        "symbols": _auto_trading_symbols,
        "interval_seconds": _auto_trading_interval,
        "message": f"Auto-trading {status}. Checando a cada {_auto_trading_interval}s"
    }


@app.get("/trading/auto-mode/")
def get_auto_mode():
    return {
        "enabled": _auto_trading_enabled,
        "symbols": _auto_trading_symbols,
        "interval_seconds": _auto_trading_interval,
        "next_run": str(scheduler.get_job('auto_trade').next_run_time) if scheduler.get_job('auto_trade') else "N/A",
        "recent_decisions": _decision_log[:20]
    }


@app.get("/trading/balance/")
def get_balance():
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
                    "free": free, "locked": locked,
                    "total": free + locked
                })
        return {"balances": balances}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/trading/status/")
def status():
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
        "testnet": os.getenv("BINANCE_TESTNET", "true").lower() == "true",
        "version": "4.0",
        "total_trades": total_trades,
        "buys": buys, "sells": sells,
        "estimated_pnl_usdt": round(pnl, 2),
        "last_trade": trade_history[-1] if trade_history else None,
        "risk_manager": risk_manager.get_status(),
        "scheduler_running": scheduler.running
    }


@app.get("/trading/history/")
def get_history():
    return {"trades": trade_history, "total": len(trade_history)}


@app.get("/trading/performance/")
def get_performance():
    """Metricas de performance reais (nao backtest)."""
    if not trade_history:
        return {"message": "Nenhum trade realizado ainda"}

    total_pnl = 0
    wins = 0
    losses = 0
    win_amounts = []
    loss_amounts = []

    # Agrupar trades por pares de BUY/SELL
    for i, t in enumerate(trade_history):
        if t['side'] == 'SELL':
            total_pnl += t['total_value']
            # Simplificado: comparar com ultimo BUY
        else:
            total_pnl -= t['total_value']

    closed = risk_manager.closed_positions
    for c in closed:
        if c['pnl'] > 0:
            wins += 1
            win_amounts.append(c['pnl'])
        else:
            losses += 1
            loss_amounts.append(abs(c['pnl']))

    total_closed = wins + losses
    win_rate = (wins / total_closed * 100) if total_closed > 0 else 0
    avg_win = sum(win_amounts) / len(win_amounts) if win_amounts else 0
    avg_loss = sum(loss_amounts) / len(loss_amounts) if loss_amounts else 0
    profit_factor = sum(win_amounts) / sum(loss_amounts) if sum(loss_amounts) > 0 else 0

    return {
        "total_trades": len(trade_history),
        "closed_positions": total_closed,
        "wins": wins,
        "losses": losses,
        "win_rate": round(win_rate, 1),
        "avg_win": round(avg_win, 2),
        "avg_loss": round(avg_loss, 2),
        "profit_factor": round(profit_factor, 2),
        "risk_reward_real": round(avg_win / avg_loss, 2) if avg_loss > 0 else 0,
        "total_pnl_closed": round(sum(c['pnl'] for c in closed), 2),
        "daily_pnl": risk_manager.daily_pnl,
        "daily_trades": risk_manager.daily_trades,
    }


# ==============================
# Risk Management
# ==============================

@app.get("/trading/risk/")
def get_risk_status():
    return risk_manager.get_status()


@app.post("/trading/risk/config/")
def update_risk_config(
    stop_loss: Optional[float] = Query(None),
    take_profit: Optional[float] = Query(None),
    risk_per_trade: Optional[float] = Query(None),
    trailing_stop: Optional[float] = Query(None),
    max_positions: Optional[int] = Query(None),
    max_daily_trades: Optional[int] = Query(None),
    max_daily_loss: Optional[float] = Query(None)
):
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
    if not risk_manager.positions:
        return {"message": "Nenhuma posicao aberta", "actions": []}

    current_prices = {}
    client = get_client()
    for pos in risk_manager.positions:
        try:
            ticker = client.get_symbol_ticker(symbol=pos.symbol)
            current_prices[pos.symbol] = float(ticker['price'])
        except Exception:
            pass

    actions = risk_manager.check_positions(current_prices)

    for action in actions:
        if action["action"] != "HOLD":
            try:
                side = "SELL" if action["side"] == "BUY" else "BUY"
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
    symbol: str = Query(...),
    side: str = Query(...),
    quantity: float = Query(None),
    use_risk_manager: bool = Query(True)
):
    try:
        client = get_client()

        if quantity is None or use_risk_manager:
            account = client.get_account()
            usdt_balance = 0
            for b in account['balances']:
                if b['asset'] == 'USDT':
                    usdt_balance = float(b['free'])
                    break

            if usdt_balance <= 0:
                raise HTTPException(status_code=400, detail="Saldo USDT insuficiente")

            can_trade = risk_manager.can_trade(usdt_balance)
            if not can_trade["allowed"]:
                return {
                    "trade_executed": False,
                    "blocked": True,
                    "reasons": can_trade["reasons"]
                }

            ticker = client.get_symbol_ticker(symbol=symbol.upper())
            current_price = float(ticker['price'])

            if quantity is None:
                quantity = risk_manager.calculate_position_size(usdt_balance, current_price)
                if "BTC" in symbol:
                    quantity = round(quantity, 5)
                elif "ETH" in symbol:
                    quantity = round(quantity, 4)
                else:
                    quantity = round(quantity, 2)

        order = client.create_order(
            symbol=symbol.upper(),
            side=SIDE_BUY if side.upper() == "BUY" else SIDE_SELL,
            type=ORDER_TYPE_MARKET,
            quantity=quantity
        )

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
        save_trade_history(trade_history)

        if side.upper() == "BUY":
            risk_manager.open_position(
                symbol=symbol.upper(), side="BUY",
                entry_price=avg_price,
                quantity=float(order['executedQty']),
                order_id=order['orderId']
            )

        logger.info(f"Trade executado: {trade}")
        notify_trade(trade)
        return trade

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro na execucao: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


def _execute_order(symbol: str, side: str, quantity: float):
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
    try:
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
                "symbol": symbol, "decision": "BLOCKED",
                "reasoning": can["reasons"], "trade_executed": None
            }

        # Chamadas com retry
        ml_data = await http_get_with_retry(
            f"{ML_SERVICE_URL}/ml/predict/",
            params={"symbol": symbol}, timeout=300
        )

        sent_data = await http_get_with_retry(
            f"{SENTIMENT_URL}/sentiment/score/",
            params={"symbol": symbol}, timeout=30
        )

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

        # Flag se algum servico falhou
        if ml_data is None:
            reason.append("AVISO: ML indisponivel, usando HOLD como fallback")
        if sent_data is None:
            reason.append("AVISO: Sentiment indisponivel, ignorando sentimento")

        result = {
            "symbol": symbol, "decision": decision,
            "ml_signal": ml_signal, "ml_confidence": ml_confidence,
            "sentiment": sentiment_label, "sentiment_score": sentiment_score,
            "reasoning": reason, "trade_executed": None,
            "risk_check": can
        }

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
    strategy: str = Query("ml_signal"),
    initial_capital: float = Query(10000),
    stop_loss: float = Query(0.03),
    take_profit: float = Query(0.06),
    risk_per_trade: float = Query(0.02)
):
    try:
        ohlcv_raw = await http_get_with_retry(
            f"{CRYPTO_FETCHER_URL}/crypto/ohlcv/",
            params={"symbol": symbol, "limit": 5000},
            timeout=60
        )
        if not ohlcv_raw:
            raise HTTPException(status_code=503, detail="Crypto fetcher indisponivel")

        # OHLCV retorna 'timestamp', backtest espera 'date'
        ohlcv_data = []
        for candle in ohlcv_raw:
            candle["date"] = candle.pop("timestamp", candle.get("date", ""))
            ohlcv_data.append(candle)

        signals = None
        if strategy == "ml_signal":
            ml_result = await http_get_with_retry(
                f"{ML_SERVICE_URL}/ml/train/",
                params={"symbol": symbol}, timeout=300
            )
            if ml_result:
                predictions = ml_result.get("predictions", [])
                metrics = ml_result.get("metrics", {})
                train_size = metrics.get("train_size", 0)

                # IMPORTANTE: so usar predicoes do TEST SET (dados nao vistos)
                # Evita overfitting — o modelo nao "viu" esses dados no treino
                if train_size > 0 and train_size < len(predictions):
                    test_signals = predictions[train_size:]
                    # Filtrar OHLCV para o mesmo periodo do test set
                    test_dates = {s["date"] for s in test_signals}
                    ohlcv_data = [c for c in ohlcv_data if c["date"] in test_dates]
                    signals = test_signals
                    logger.info(
                        f"Backtest ML: {len(signals)} sinais test-set, "
                        f"{len(ohlcv_data)} candles matched "
                        f"(descartando {train_size} do treino)"
                    )
                else:
                    signals = predictions

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
    return {
        "strategies": [
            {"id": "ml_signal", "name": "ML Signal (Random Forest)", "description": "Segue sinais BUY/SELL do modelo ML com SL/TP automaticos", "best_for": "Tendencias claras com dados suficientes"},
            {"id": "rsi_mean_reversion", "name": "RSI Mean Reversion", "description": "Compra quando RSI < 30, vende quando RSI > 70", "best_for": "Mercados laterais"},
            {"id": "ema_crossover", "name": "EMA Crossover (7/21)", "description": "Compra quando EMA rapida cruza acima da lenta", "best_for": "Mercados com tendencia"},
            {"id": "smart_dca", "name": "Smart DCA", "description": "Compra periodicamente, aumentando quando RSI esta baixo", "best_for": "Longo prazo, menor risco"},
        ]
    }
