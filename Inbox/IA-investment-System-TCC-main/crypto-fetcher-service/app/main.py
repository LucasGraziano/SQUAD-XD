from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from apscheduler.schedulers.background import BackgroundScheduler
import logging

from app.data import models, schemas, database, crud
from app.services import (
    add_crypto_pair, update_all_pairs, get_current_price, get_available_pairs
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Crypto Fetcher Service", version="2.0")

# Criar tabelas
models.Base.metadata.create_all(bind=database.engine)

# Scheduler para atualização diária
scheduler = BackgroundScheduler()
scheduler.start()

@scheduler.scheduled_job('cron', hour=0, minute=5, timezone='UTC')
def daily_update():
    """Atualiza todos os pares à meia-noite UTC."""
    db = next(database.get_db())
    try:
        count = update_all_pairs(db)
        logger.info(f"Atualização diária: {count} novos registros")
    finally:
        db.close()


# ── ENDPOINTS ──

@app.get("/health")
def health():
    return {"status": "ok", "service": "crypto-fetcher"}

@app.post("/crypto/add-pair/")
def add_pair(symbol: str = Query(..., description="Ex: BTCUSDT"), db: Session = Depends(database.get_db)):
    try:
        pair, count = add_crypto_pair(db, symbol)
        return {
            "symbol": pair.symbol,
            "base_asset": pair.base_asset,
            "quote_asset": pair.quote_asset,
            "records_fetched": count
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/crypto/ohlcv/")
def get_ohlcv_data(
    symbol: str = Query(...),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    limit: int = Query(1000, le=5000),
    db: Session = Depends(database.get_db)
):
    data = crud.get_ohlcv(db, symbol, start_date, end_date, limit)
    if not data:
        raise HTTPException(status_code=404, detail=f"Sem dados para {symbol}")
    return [
        {
            "symbol": d.symbol,
            "timestamp": d.timestamp.isoformat(),
            "open": d.open,
            "high": d.high,
            "low": d.low,
            "close": d.close,
            "volume": d.volume
        }
        for d in data
    ]

@app.get("/crypto/ml-data/")
def get_ml_data(symbol: str = Query(...), db: Session = Depends(database.get_db)):
    """Dados formatados para treinamento ML (sem limite)."""
    data = crud.get_ohlcv(db, symbol, limit=10000)
    if not data:
        raise HTTPException(status_code=404, detail=f"Sem dados para {symbol}")
    return [
        {
            "date": d.timestamp.strftime("%Y-%m-%d"),
            "open": d.open,
            "high": d.high,
            "low": d.low,
            "close": d.close,
            "volume": d.volume
        }
        for d in data
    ]

@app.get("/crypto/price/")
def get_price(symbol: str = Query(...)):
    try:
        price = get_current_price(symbol)
        return {"symbol": symbol.upper(), "price": price}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/crypto/pairs/")
def list_pairs(db: Session = Depends(database.get_db)):
    pairs = crud.get_all_pairs(db)
    return [{"symbol": p.symbol, "base": p.base_asset, "quote": p.quote_asset} for p in pairs]

@app.get("/crypto/available/")
def available_pairs():
    """Top 20 pares da Binance por volume."""
    try:
        return get_available_pairs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/crypto/update/")
def force_update(db: Session = Depends(database.get_db)):
    count = update_all_pairs(db)
    return {"updated_records": count}
