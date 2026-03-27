from fastapi import FastAPI, HTTPException, Query
import httpx
import os
import logging

from app.services.model import Model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ML Prediction Service", version="2.0")

CRYPTO_FETCHER_URL = os.getenv("CRYPTO_FETCHER_URL", "http://crypto-fetcher-service:8000")

@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-prediction"}

@app.get("/ml/train/")
async def train_model(symbol: str = Query(..., description="Ex: BTCUSDT")):
    """Treina modelo Random Forest com dados históricos do par crypto."""
    try:
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.get(
                f"{CRYPTO_FETCHER_URL}/crypto/ml-data/",
                params={"symbol": symbol}
            )

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)

            data = response.json()
            logger.info(f"Recebidos {len(data)} registros para {symbol}")

            model = Model()
            result = await model.train_model(data)
            return result

    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="Timeout no treinamento. Tente com menos dados.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/ml/predict/")
async def predict(symbol: str = Query(...)):
    """Retorna apenas o último sinal (sem retreinar)."""
    result = await train_model(symbol)
    return result["latest_signal"]
