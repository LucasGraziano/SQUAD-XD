from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import Optional
import os
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Crypto Investment API Gateway", version="3.0")

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

@app.get("/health")
def health():
    return {"status": "ok", "service": "api-gateway"}

# ── CRYPTO DATA ──

@app.post("/api/crypto/add-pair/")
async def add_pair(symbol: str = Query(...)):
    async with httpx.AsyncClient(timeout=120) as client:
        r = await client.post(f"{CRYPTO_FETCHER_URL}/crypto/add-pair/", params={"symbol": symbol})
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/api/crypto/ohlcv/")
async def get_ohlcv(symbol: str, start_date: Optional[str] = None, end_date: Optional[str] = None):
    params = {"symbol": symbol, "start_date": start_date, "end_date": end_date}
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(f"{CRYPTO_FETCHER_URL}/crypto/ohlcv/", params=params)
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/api/crypto/price/")
async def get_price(symbol: str):
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{CRYPTO_FETCHER_URL}/crypto/price/", params={"symbol": symbol})
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/api/crypto/pairs/")
async def list_pairs():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{CRYPTO_FETCHER_URL}/crypto/pairs/")
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/api/crypto/available/")
async def available_pairs():
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(f"{CRYPTO_FETCHER_URL}/crypto/available/")
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

# ── ML PREDICTION ──

@app.get("/api/ml/train/")
async def train_model(symbol: str):
    async with httpx.AsyncClient(timeout=300) as client:
        r = await client.get(f"{ML_SERVICE_URL}/ml/train/", params={"symbol": symbol})
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/api/ml/predict/")
async def predict(symbol: str):
    async with httpx.AsyncClient(timeout=300) as client:
        r = await client.get(f"{ML_SERVICE_URL}/ml/predict/", params={"symbol": symbol})
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

# ── SENTIMENT ──

@app.get("/api/sentiment/")
async def sentiment(symbol: str, days: int = 3):
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(f"{SENTIMENT_URL}/sentiment/analyze/", params={"symbol": symbol, "days": days})
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/api/sentiment/score/")
async def sentiment_score(symbol: str):
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(f"{SENTIMENT_URL}/sentiment/score/", params={"symbol": symbol})
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

# ── TRADING BOT ──

@app.get("/api/trading/status/")
async def trading_status():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{TRADING_BOT_URL}/trading/status/")
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.post("/api/trading/execute/")
async def execute_trade(symbol: str, side: str, quantity: Optional[float] = None,
                        use_risk_manager: bool = True):
    params = {"symbol": symbol, "side": side, "use_risk_manager": use_risk_manager}
    if quantity is not None:
        params["quantity"] = quantity
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(f"{TRADING_BOT_URL}/trading/execute/", params=params)
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.post("/api/trading/auto/")
async def auto_trade(symbol: str):
    async with httpx.AsyncClient(timeout=300) as client:
        r = await client.post(f"{TRADING_BOT_URL}/trading/auto/", params={"symbol": symbol})
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/api/trading/history/")
async def trade_history():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{TRADING_BOT_URL}/trading/history/")
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/api/trading/balance/")
async def balance():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{TRADING_BOT_URL}/trading/balance/")
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

# ── SENTIMENT ANALYZE (full) ──

@app.get("/api/sentiment/analyze/")
async def sentiment_analyze(symbol: str, days: int = 3):
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(f"{SENTIMENT_URL}/sentiment/analyze/", params={"symbol": symbol, "days": days})
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

# ── RISK MANAGEMENT ──

@app.get("/api/trading/risk/")
async def risk_status():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{TRADING_BOT_URL}/trading/risk/")
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

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
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(f"{TRADING_BOT_URL}/trading/risk/config/", params=params)
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.post("/api/trading/risk/check-positions/")
async def check_positions():
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(f"{TRADING_BOT_URL}/trading/risk/check-positions/")
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

# ── BACKTESTING ──

@app.post("/api/trading/backtest/")
async def backtest(
    symbol: str = "BTCUSDT", strategy: str = "ml_signal",
    initial_capital: float = 10000, stop_loss: float = 0.03,
    take_profit: float = 0.06, risk_per_trade: float = 0.02
):
    async with httpx.AsyncClient(timeout=600) as client:
        r = await client.post(f"{TRADING_BOT_URL}/trading/backtest/", params={
            "symbol": symbol, "strategy": strategy, "initial_capital": initial_capital,
            "stop_loss": stop_loss, "take_profit": take_profit, "risk_per_trade": risk_per_trade
        })
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/api/trading/backtest/strategies/")
async def backtest_strategies():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{TRADING_BOT_URL}/trading/backtest/strategies/")
        if r.status_code == 200: return r.json()
        raise HTTPException(status_code=r.status_code, detail=r.text)
