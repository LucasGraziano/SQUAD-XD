from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import Optional
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='{"time":"%(asctime)s","level":"%(levelname)s","module":"%(name)s","msg":"%(message)s"}'
)

app = FastAPI(title="Crypto Investment API Gateway", version="4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CRYPTO_FETCHER_URL = os.getenv("CRYPTO_FETCHER_URL", "http://crypto-fetcher-service:8000")
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://ml-prediction-service:8000")
SENTIMENT_URL = os.getenv("SENTIMENT_URL", "http://sentiment-analysis-service:8000")
TRADING_BOT_URL = os.getenv("TRADING_BOT_URL", "http://trading-bot-service:8000")


async def _proxy(method: str, url: str, params: dict = None, timeout: int = 30):
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            if method == "GET":
                r = await client.get(url, params=params)
            else:
                r = await client.post(url, params=params)
            if r.status_code == 200:
                return r.json()
            raise HTTPException(status_code=r.status_code, detail=r.text)
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Servico indisponivel")
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="Timeout no servico")


@app.get("/health")
async def health():
    services = {}
    for name, url in [
        ("crypto-fetcher", CRYPTO_FETCHER_URL),
        ("ml-prediction", ML_SERVICE_URL),
        ("sentiment", SENTIMENT_URL),
        ("trading-bot", TRADING_BOT_URL),
    ]:
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                r = await client.get(f"{url}/health")
                services[name] = r.json() if r.status_code == 200 else {"status": "error"}
        except Exception:
            services[name] = {"status": "unreachable"}

    return {"status": "ok", "service": "api-gateway", "version": "4.0", "services": services}


# ── CRYPTO DATA ──

@app.post("/api/crypto/add-pair/")
async def add_pair(symbol: str = Query(...)):
    return await _proxy("POST", f"{CRYPTO_FETCHER_URL}/crypto/add-pair/", {"symbol": symbol}, timeout=120)

@app.get("/api/crypto/ohlcv/")
async def get_ohlcv(symbol: str, start_date: Optional[str] = None, end_date: Optional[str] = None):
    return await _proxy("GET", f"{CRYPTO_FETCHER_URL}/crypto/ohlcv/", {"symbol": symbol, "start_date": start_date, "end_date": end_date})

@app.get("/api/crypto/price/")
async def get_price(symbol: str):
    return await _proxy("GET", f"{CRYPTO_FETCHER_URL}/crypto/price/", {"symbol": symbol}, timeout=10)

@app.get("/api/crypto/pairs/")
async def list_pairs():
    return await _proxy("GET", f"{CRYPTO_FETCHER_URL}/crypto/pairs/", timeout=10)

@app.get("/api/crypto/available/")
async def available_pairs():
    return await _proxy("GET", f"{CRYPTO_FETCHER_URL}/crypto/available/", timeout=15)

@app.get("/api/crypto/prices/live/")
async def live_prices():
    return await _proxy("GET", f"{CRYPTO_FETCHER_URL}/crypto/prices/live/", timeout=10)


# ── ML PREDICTION ──

@app.get("/api/ml/train/")
async def train_model(symbol: str):
    return await _proxy("GET", f"{ML_SERVICE_URL}/ml/train/", {"symbol": symbol}, timeout=300)

@app.get("/api/ml/predict/")
async def predict(symbol: str):
    return await _proxy("GET", f"{ML_SERVICE_URL}/ml/predict/", {"symbol": symbol}, timeout=300)

@app.get("/api/ml/status/")
async def ml_status():
    return await _proxy("GET", f"{ML_SERVICE_URL}/ml/status/", timeout=10)

@app.post("/api/ml/retrain/")
async def retrain_model(symbol: str):
    return await _proxy("POST", f"{ML_SERVICE_URL}/ml/retrain/", {"symbol": symbol}, timeout=600)

@app.post("/api/ml/retrain-all/")
async def retrain_all():
    return await _proxy("POST", f"{ML_SERVICE_URL}/ml/retrain-all/", timeout=600)


# ── SENTIMENT ──

@app.get("/api/sentiment/")
async def sentiment(symbol: str, days: int = 3):
    return await _proxy("GET", f"{SENTIMENT_URL}/sentiment/analyze/", {"symbol": symbol, "days": days})

@app.get("/api/sentiment/score/")
async def sentiment_score(symbol: str):
    return await _proxy("GET", f"{SENTIMENT_URL}/sentiment/score/", {"symbol": symbol}, timeout=15)

@app.get("/api/sentiment/analyze/")
async def sentiment_analyze(symbol: str, days: int = 3):
    return await _proxy("GET", f"{SENTIMENT_URL}/sentiment/analyze/", {"symbol": symbol, "days": days})


# ── TRADING BOT ──

@app.get("/api/trading/status/")
async def trading_status():
    return await _proxy("GET", f"{TRADING_BOT_URL}/trading/status/", timeout=10)

@app.post("/api/trading/execute/")
async def execute_trade(symbol: str, side: str, quantity: Optional[float] = None, use_risk_manager: bool = True):
    params = {"symbol": symbol, "side": side, "use_risk_manager": use_risk_manager}
    if quantity is not None:
        params["quantity"] = quantity
    return await _proxy("POST", f"{TRADING_BOT_URL}/trading/execute/", params)

@app.post("/api/trading/auto/")
async def auto_trade(symbol: str):
    return await _proxy("POST", f"{TRADING_BOT_URL}/trading/auto/", {"symbol": symbol}, timeout=300)

@app.post("/api/trading/auto-mode/")
async def auto_mode(enabled: bool, interval: int = 300, symbols: str = "BTCUSDT"):
    return await _proxy("POST", f"{TRADING_BOT_URL}/trading/auto-mode/", {
        "enabled": enabled, "interval": interval, "symbols": symbols
    })

@app.get("/api/trading/auto-mode/")
async def get_auto_mode():
    return await _proxy("GET", f"{TRADING_BOT_URL}/trading/auto-mode/", timeout=10)

@app.get("/api/trading/history/")
async def trade_history():
    return await _proxy("GET", f"{TRADING_BOT_URL}/trading/history/", timeout=10)

@app.get("/api/trading/balance/")
async def balance():
    return await _proxy("GET", f"{TRADING_BOT_URL}/trading/balance/", timeout=10)

@app.get("/api/trading/performance/")
async def performance():
    return await _proxy("GET", f"{TRADING_BOT_URL}/trading/performance/", timeout=10)


# ── RISK MANAGEMENT ──

@app.get("/api/trading/risk/")
async def risk_status():
    return await _proxy("GET", f"{TRADING_BOT_URL}/trading/risk/", timeout=10)

@app.post("/api/trading/risk/config/")
async def risk_config(
    stop_loss: Optional[float] = None, take_profit: Optional[float] = None,
    risk_per_trade: Optional[float] = None, trailing_stop: Optional[float] = None,
    max_positions: Optional[int] = None, max_daily_trades: Optional[int] = None,
    max_daily_loss: Optional[float] = None
):
    params = {}
    if stop_loss is not None: params["stop_loss"] = stop_loss
    if take_profit is not None: params["take_profit"] = take_profit
    if risk_per_trade is not None: params["risk_per_trade"] = risk_per_trade
    if trailing_stop is not None: params["trailing_stop"] = trailing_stop
    if max_positions is not None: params["max_positions"] = max_positions
    if max_daily_trades is not None: params["max_daily_trades"] = max_daily_trades
    if max_daily_loss is not None: params["max_daily_loss"] = max_daily_loss
    return await _proxy("POST", f"{TRADING_BOT_URL}/trading/risk/config/", params)

@app.post("/api/trading/risk/check-positions/")
async def check_positions():
    return await _proxy("POST", f"{TRADING_BOT_URL}/trading/risk/check-positions/")


# ── BACKTESTING ──

@app.post("/api/trading/backtest/")
async def backtest(
    symbol: str = "BTCUSDT", strategy: str = "ml_signal",
    initial_capital: float = 10000, stop_loss: float = 0.03,
    take_profit: float = 0.06, risk_per_trade: float = 0.02
):
    return await _proxy("POST", f"{TRADING_BOT_URL}/trading/backtest/", {
        "symbol": symbol, "strategy": strategy, "initial_capital": initial_capital,
        "stop_loss": stop_loss, "take_profit": take_profit, "risk_per_trade": risk_per_trade
    }, timeout=600)

@app.get("/api/trading/backtest/strategies/")
async def backtest_strategies():
    return await _proxy("GET", f"{TRADING_BOT_URL}/trading/backtest/strategies/", timeout=10)
