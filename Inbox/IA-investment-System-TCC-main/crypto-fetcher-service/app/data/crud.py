from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from . import models
from typing import List, Optional
from datetime import datetime

def get_pair_by_symbol(db: Session, symbol: str):
    return db.query(models.CryptoPair).filter(models.CryptoPair.symbol == symbol.upper()).first()

def create_pair(db: Session, symbol: str, base_asset: str, quote_asset: str):
    pair = models.CryptoPair(symbol=symbol.upper(), base_asset=base_asset, quote_asset=quote_asset)
    db.add(pair)
    db.commit()
    db.refresh(pair)
    return pair

def get_all_pairs(db: Session):
    return db.query(models.CryptoPair).filter(models.CryptoPair.is_active == 1).all()

def bulk_upsert_ohlcv(db: Session, records: List[dict]):
    """Insere em batch, ignora duplicatas (symbol+timestamp)."""
    if not records:
        return 0

    stmt = insert(models.OHLCVData).values(records)
    stmt = stmt.on_conflict_do_nothing(constraint='uq_symbol_timestamp')
    result = db.execute(stmt)
    db.commit()
    return result.rowcount

def get_ohlcv(db: Session, symbol: str, start_date: Optional[str] = None,
              end_date: Optional[str] = None, limit: int = 1000):
    query = db.query(models.OHLCVData).filter(models.OHLCVData.symbol == symbol.upper())

    if start_date:
        query = query.filter(models.OHLCVData.timestamp >= start_date)
    if end_date:
        query = query.filter(models.OHLCVData.timestamp <= end_date)

    return query.order_by(models.OHLCVData.timestamp.asc()).limit(limit).all()

def get_latest_timestamp(db: Session, symbol: str):
    result = db.query(models.OHLCVData.timestamp)\
        .filter(models.OHLCVData.symbol == symbol.upper())\
        .order_by(models.OHLCVData.timestamp.desc())\
        .first()
    return result[0] if result else None
