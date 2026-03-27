from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CryptoPairBase(BaseModel):
    symbol: str
    base_asset: str
    quote_asset: str

class CryptoPairCreate(CryptoPairBase):
    pass

class CryptoPair(CryptoPairBase):
    id: int
    is_active: int

    class Config:
        orm_mode = True

class OHLCVBase(BaseModel):
    symbol: str
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float

class OHLCVCreate(OHLCVBase):
    pair_id: int

class OHLCV(OHLCVBase):
    id: int

    class Config:
        orm_mode = True
