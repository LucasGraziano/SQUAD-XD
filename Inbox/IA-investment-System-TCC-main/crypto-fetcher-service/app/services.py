from binance.client import Client
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.data import crud, models
import os
import logging

logger = logging.getLogger(__name__)

def get_binance_client():
    api_key = os.getenv("BINANCE_API_KEY", "")
    secret_key = os.getenv("BINANCE_SECRET_KEY", "")
    testnet = os.getenv("BINANCE_TESTNET", "true").lower() == "true"

    client = Client(api_key, secret_key, testnet=testnet)
    return client

def add_crypto_pair(db: Session, symbol: str):
    """Adiciona um par e busca todo o histórico da Binance."""
    symbol = symbol.upper()

    existing = crud.get_pair_by_symbol(db, symbol)
    if existing:
        raise ValueError(f"Par {symbol} já existe")

    client = get_binance_client()

    # Validar que o par existe na Binance
    try:
        info = client.get_symbol_info(symbol)
        if not info:
            raise ValueError(f"Par {symbol} não encontrado na Binance")
    except Exception as e:
        raise ValueError(f"Erro ao buscar {symbol}: {str(e)}")

    base_asset = info.get('baseAsset', symbol[:3])
    quote_asset = info.get('quoteAsset', symbol[3:])

    pair = crud.create_pair(db, symbol, base_asset, quote_asset)

    # Buscar histórico (últimos 2 anos de klines diárias)
    count = fetch_historical_klines(db, pair, symbol, "2 years ago UTC")

    logger.info(f"Par {symbol} adicionado com {count} registros")
    return pair, count

def fetch_historical_klines(db: Session, pair, symbol: str, start_str: str):
    """Busca klines históricas da Binance e salva no DB."""
    client = get_binance_client()

    klines = client.get_historical_klines(
        symbol, Client.KLINE_INTERVAL_1DAY, start_str
    )

    records = []
    for k in klines:
        records.append({
            "pair_id": pair.id,
            "symbol": symbol,
            "timestamp": datetime.utcfromtimestamp(k[0] / 1000),
            "open": float(k[1]),
            "high": float(k[2]),
            "low": float(k[3]),
            "close": float(k[4]),
            "volume": float(k[5])
        })

    count = crud.bulk_upsert_ohlcv(db, records)
    return count

def update_all_pairs(db: Session):
    """Atualiza dados diários de todos os pares ativos."""
    pairs = crud.get_all_pairs(db)
    client = get_binance_client()
    total = 0

    for pair in pairs:
        try:
            # Buscar desde o último registro
            latest = crud.get_latest_timestamp(db, pair.symbol)
            if latest:
                start_str = (latest + timedelta(days=1)).strftime("%d %b %Y")
            else:
                start_str = "2 years ago UTC"

            klines = client.get_historical_klines(
                pair.symbol, Client.KLINE_INTERVAL_1DAY, start_str
            )

            records = []
            for k in klines:
                records.append({
                    "pair_id": pair.id,
                    "symbol": pair.symbol,
                    "timestamp": datetime.utcfromtimestamp(k[0] / 1000),
                    "open": float(k[1]),
                    "high": float(k[2]),
                    "low": float(k[3]),
                    "close": float(k[4]),
                    "volume": float(k[5])
                })

            count = crud.bulk_upsert_ohlcv(db, records)
            total += count
            logger.info(f"Atualizado {pair.symbol}: +{count} registros")
        except Exception as e:
            logger.error(f"Erro atualizando {pair.symbol}: {str(e)}")

    return total

def get_current_price(symbol: str):
    """Preço atual em tempo real."""
    client = get_binance_client()
    ticker = client.get_symbol_ticker(symbol=symbol.upper())
    return float(ticker['price'])

def get_available_pairs():
    """Lista os pares mais populares da Binance."""
    client = get_binance_client()
    tickers = client.get_ticker()

    # Top 20 por volume
    sorted_tickers = sorted(tickers, key=lambda x: float(x['quoteVolume']), reverse=True)

    pairs = []
    for t in sorted_tickers[:30]:
        if t['symbol'].endswith('USDT'):
            pairs.append({
                "symbol": t['symbol'],
                "price": float(t['lastPrice']),
                "change_24h": float(t['priceChangePercent']),
                "volume_24h": float(t['quoteVolume'])
            })
            if len(pairs) >= 20:
                break

    return pairs
