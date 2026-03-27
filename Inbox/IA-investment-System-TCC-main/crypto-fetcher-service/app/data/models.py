from sqlalchemy import Column, Integer, String, Float, DateTime, BigInteger, UniqueConstraint
from .database import Base

class CryptoPair(Base):
    __tablename__ = "crypto_pair"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True)  # ex: BTCUSDT
    base_asset = Column(String)   # ex: BTC
    quote_asset = Column(String)  # ex: USDT
    is_active = Column(Integer, default=1)

class OHLCVData(Base):
    __tablename__ = "ohlcv_data"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pair_id = Column(Integer, index=True)
    symbol = Column(String, index=True)
    timestamp = Column(DateTime, index=True)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Float)

    __table_args__ = (
        UniqueConstraint('symbol', 'timestamp', name='uq_symbol_timestamp'),
    )
