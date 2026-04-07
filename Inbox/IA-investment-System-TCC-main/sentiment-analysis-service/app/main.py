from fastapi import FastAPI, Query
from typing import Optional
from datetime import datetime, timedelta
import logging
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Sentiment Analysis Service", version="4.0")

# Lazy imports — GoogleNews e VADER podem falhar
_analyzer = None
_googlenews_available = True


# Fontes confiaveis para noticias crypto (ponderacao)
SOURCE_WEIGHTS = {
    "coindesk": 1.5, "cointelegraph": 1.5, "the block": 1.5,
    "bloomberg": 1.4, "reuters": 1.4, "cnbc": 1.3, "wsj": 1.3,
    "fortune": 1.2, "yahoo finance": 1.2, "investing.com": 1.2,
    "bitcoin magazine": 1.2, "decrypt": 1.2, "seeking alpha": 1.1,
}

# Palavras-chave crypto que VADER nao entende — boost manual
CRYPTO_BULLISH = [
    "rally", "surge", "soar", "breakout", "all-time high", "ath",
    "adoption", "etf approved", "institutional", "accumulation",
    "bullish", "moon", "pump", "upgrade", "partnership",
]
CRYPTO_BEARISH = [
    "crash", "plunge", "dump", "selloff", "sell-off", "liquidat",
    "hack", "exploit", "ban", "crack down", "crackdown", "fraud",
    "bearish", "collapse", "rug pull", "ponzi", "sec sues",
]


def get_analyzer():
    global _analyzer
    if _analyzer is None:
        from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
        _analyzer = SentimentIntensityAnalyzer()
    return _analyzer


CRYPTO_NAMES = {
    "BTCUSDT": "Bitcoin BTC",
    "ETHUSDT": "Ethereum ETH",
    "BNBUSDT": "BNB Binance",
    "SOLUSDT": "Solana SOL",
    "ADAUSDT": "Cardano ADA",
    "DOTUSDT": "Polkadot DOT",
    "XRPUSDT": "Ripple XRP",
    "DOGEUSDT": "Dogecoin DOGE",
    "AVAXUSDT": "Avalanche AVAX",
    "LINKUSDT": "Chainlink LINK",
}


def get_search_term(symbol: str) -> str:
    return CRYPTO_NAMES.get(symbol.upper(), symbol.replace("USDT", "") + " crypto")


def _crypto_boost(text: str) -> float:
    """Ajuste de score para termos crypto que VADER ignora."""
    text_lower = text.lower()
    boost = 0.0
    for term in CRYPTO_BULLISH:
        if term in text_lower:
            boost += 0.15
    for term in CRYPTO_BEARISH:
        if term in text_lower:
            boost -= 0.15
    return max(-0.5, min(0.5, boost))


def _source_weight(source: str) -> float:
    """Peso da fonte (1.0 default, mais alto para fontes confiaveis)."""
    src = source.lower().strip()
    for key, weight in SOURCE_WEIGHTS.items():
        if key in src:
            return weight
    return 0.8  # fontes desconhecidas pesam menos


def analyze_sentiment(text: str, source: str = "") -> dict:
    analyzer = get_analyzer()
    scores = analyzer.polarity_scores(text)
    compound = scores['compound']

    # Boost para termos crypto
    boost = _crypto_boost(text)
    adjusted = max(-1.0, min(1.0, compound + boost))

    # Peso da fonte
    weight = _source_weight(source)

    if adjusted >= 0.05:
        label = "BULLISH"
    elif adjusted <= -0.05:
        label = "BEARISH"
    else:
        label = "NEUTRAL"

    return {
        "compound": round(adjusted, 4),
        "raw_vader": round(compound, 4),
        "crypto_boost": round(boost, 4),
        "source_weight": weight,
        "positive": round(scores['pos'], 4),
        "negative": round(scores['neg'], 4),
        "neutral": round(scores['neu'], 4),
        "label": label
    }


def fetch_crypto_news(symbol: str, days: int = 3) -> list:
    global _googlenews_available

    articles = []

    if _googlenews_available:
        try:
            from GoogleNews import GoogleNews
            search_term = get_search_term(symbol)
            end = datetime.today()
            start = end - timedelta(days=days)

            gn = GoogleNews(
                lang='en',
                start=start.strftime('%m/%d/%Y'),
                end=end.strftime('%m/%d/%Y'),
                encode='utf-8'
            )
            gn.get_news(search_term)
            results = gn.results()

            # Deduplicar por titulo (GoogleNews retorna duplicatas)
            seen_titles = set()
            for r in results:
                title = r.get('title', '').strip()
                if not title:
                    continue

                # Normalizar titulo para dedup
                title_key = re.sub(r'[^a-z0-9]', '', title.lower())[:60]
                if title_key in seen_titles:
                    continue
                seen_titles.add(title_key)

                source = r.get('media', '')
                desc = r.get('desc', '')
                text = f"{title}. {desc}" if desc else title
                sentiment = analyze_sentiment(text, source)

                articles.append({
                    "title": title,
                    "source": source,
                    "date": r.get('date', ''),
                    "link": r.get('link', ''),
                    "sentiment": sentiment
                })

                if len(articles) >= 15:
                    break

            return articles

        except ImportError:
            logger.warning("GoogleNews nao instalado, usando fallback")
            _googlenews_available = False
        except Exception as e:
            logger.warning(f"GoogleNews falhou: {e}, usando fallback")

    logger.info(f"Usando fallback NEUTRAL para {symbol}")
    return []


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "sentiment-analysis",
        "version": "3.0",
        "googlenews_available": _googlenews_available
    }


@app.get("/sentiment/analyze/")
def analyze(symbol: str = Query(...), days: int = Query(3, le=7)):
    try:
        articles = fetch_crypto_news(symbol, days)

        if not articles:
            return {
                "symbol": symbol,
                "articles_count": 0,
                "overall_sentiment": "NEUTRAL",
                "average_score": 0,
                "distribution": {"bullish": 0, "bearish": 0, "neutral": 0},
                "articles": [],
                "fallback": not _googlenews_available
            }

        # Score ponderado por confiabilidade da fonte
        total_weight = 0
        weighted_sum = 0
        for a in articles:
            w = a['sentiment']['source_weight']
            weighted_sum += a['sentiment']['compound'] * w
            total_weight += w

        avg_score = weighted_sum / total_weight if total_weight > 0 else 0

        if avg_score >= 0.05:
            overall = "BULLISH"
        elif avg_score <= -0.05:
            overall = "BEARISH"
        else:
            overall = "NEUTRAL"

        bullish_count = sum(1 for a in articles if a['sentiment']['compound'] >= 0.05)
        bearish_count = sum(1 for a in articles if a['sentiment']['compound'] <= -0.05)
        neutral_count = len(articles) - bullish_count - bearish_count

        return {
            "symbol": symbol,
            "articles_count": len(articles),
            "overall_sentiment": overall,
            "average_score": round(avg_score, 4),
            "distribution": {
                "bullish": bullish_count,
                "bearish": bearish_count,
                "neutral": neutral_count
            },
            "articles": articles
        }

    except Exception as e:
        logger.error(f"Erro no sentiment analysis: {str(e)}")
        return {
            "symbol": symbol,
            "articles_count": 0,
            "overall_sentiment": "NEUTRAL",
            "average_score": 0,
            "error": str(e),
            "articles": []
        }


@app.get("/sentiment/score/")
def quick_score(symbol: str = Query(...)):
    result = analyze(symbol)
    return {
        "symbol": symbol,
        "score": result["average_score"],
        "sentiment": result["overall_sentiment"],
        "articles_analyzed": result["articles_count"]
    }
