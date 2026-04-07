from fastapi import FastAPI, HTTPException, Query
import httpx
import os
import logging
import asyncio
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

from app.services.model import Model

logging.basicConfig(
    level=logging.INFO,
    format='{"time":"%(asctime)s","level":"%(levelname)s","module":"%(name)s","msg":"%(message)s"}'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="ML Prediction Service", version="4.0")

CRYPTO_FETCHER_URL = os.getenv("CRYPTO_FETCHER_URL", "http://crypto-fetcher-service:8000")
RETRAIN_HOUR = int(os.getenv("RETRAIN_HOUR", "2"))  # Retreinar as 2h UTC por default
model = Model()


async def _fetch_data(symbol: str) -> list:
    async with httpx.AsyncClient(timeout=300) as client:
        response = await client.get(
            f"{CRYPTO_FETCHER_URL}/crypto/ml-data/",
            params={"symbol": symbol}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        data = response.json()
        logger.info(f"Recebidos {len(data)} registros para {symbol}")
        return data


def _fetch_data_sync(symbol: str) -> list:
    """Versao sincrona para uso no scheduler."""
    import httpx as httpx_sync
    with httpx_sync.Client(timeout=300) as client:
        response = client.get(
            f"{CRYPTO_FETCHER_URL}/crypto/ml-data/",
            params={"symbol": symbol}
        )
        if response.status_code != 200:
            return []
        return response.json()


# ==============================
# Scheduler — Retrain diario automatico
# ==============================

scheduler = BackgroundScheduler()


def scheduled_retrain():
    """Retreina todos os modelos cacheados 1x/dia."""
    symbols = list(Model._cache.keys())
    if not symbols:
        logger.info("Retrain agendado: nenhum modelo em cache para retreinar")
        return

    logger.info(f"Retrain agendado iniciado para {len(symbols)} modelos: {symbols}")

    for symbol in symbols:
        try:
            data = _fetch_data_sync(symbol)
            if not data:
                logger.warning(f"[{symbol}] Sem dados para retrain")
                continue

            # Rodar treino sincrono (bloqueante mas OK em thread do scheduler)
            import asyncio
            loop = asyncio.new_event_loop()
            result = loop.run_until_complete(model.train_model(data, symbol))
            loop.close()

            metrics = result.get("metrics", {})
            logger.info(
                f"[{symbol}] Retrain completo — "
                f"Test RMSE: {metrics.get('test_rmse')}, "
                f"Overfit ratio: {metrics.get('overfit_ratio')}"
            )
        except Exception as e:
            logger.error(f"[{symbol}] Erro no retrain agendado: {e}")

    logger.info("Retrain agendado finalizado")


scheduler.add_job(
    scheduled_retrain,
    'cron',
    hour=RETRAIN_HOUR,
    minute=0,
    id='daily_retrain',
    timezone='UTC'
)
scheduler.start()
logger.info(f"Scheduler de retrain iniciado (diario as {RETRAIN_HOUR}:00 UTC)")


# ==============================
# Endpoints
# ==============================

@app.get("/health")
def health():
    cached_symbols = list(Model._cache.keys())
    return {
        "status": "ok",
        "service": "ml-prediction",
        "version": "4.0",
        "cached_models": cached_symbols,
        "retrain_schedule": f"Daily at {RETRAIN_HOUR}:00 UTC",
        "scheduler_running": scheduler.running
    }


@app.get("/ml/train/")
async def train_model_endpoint(symbol: str = Query(..., description="Ex: BTCUSDT")):
    """Treina modelo Random Forest com dados historicos (operacao pesada, ~2-5min)."""
    try:
        data = await _fetch_data(symbol)
        result = await model.train_model(data, symbol)
        return result
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="Timeout no treinamento.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/ml/predict/")
async def predict(symbol: str = Query(...)):
    """Predicao rapida usando modelo cacheado. Treina automaticamente se necessario."""
    try:
        data = await _fetch_data(symbol)
        result = await model.predict(data, symbol)
        return result
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="Timeout ao buscar dados.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/ml/retrain/")
async def force_retrain(symbol: str = Query(...)):
    """Forca retreino imediato de um modelo."""
    try:
        data = await _fetch_data(symbol)
        result = await model.train_model(data, symbol)
        return {
            "message": f"Modelo {symbol} retreinado com sucesso",
            "metrics": result.get("metrics", {}),
            "latest_signal": result.get("latest_signal", {})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ml/retrain-all/")
async def retrain_all():
    """Forca retreino de todos os modelos cacheados."""
    symbols = list(Model._cache.keys())
    if not symbols:
        return {"message": "Nenhum modelo em cache para retreinar"}

    results = {}
    for symbol in symbols:
        try:
            data = await _fetch_data(symbol)
            result = await model.train_model(data, symbol)
            results[symbol] = {
                "status": "ok",
                "test_rmse": result.get("metrics", {}).get("test_rmse"),
                "overfit_ratio": result.get("metrics", {}).get("overfit_ratio")
            }
        except Exception as e:
            results[symbol] = {"status": "error", "error": str(e)}

    return {"retrained": len(results), "results": results}


@app.get("/ml/status/")
def model_status():
    """Status dos modelos cacheados."""
    status = {}
    for symbol, info in Model._cache.items():
        status[symbol] = {
            "trained_at": info.get("trained_at"),
            "records_used": info.get("records_used"),
            "metrics": info.get("metrics", {})
        }
    return {
        "models": status,
        "total_cached": len(status),
        "retrain_schedule": f"Daily at {RETRAIN_HOUR}:00 UTC",
        "next_retrain": str(scheduler.get_job('daily_retrain').next_run_time) if scheduler.get_job('daily_retrain') else "N/A"
    }
