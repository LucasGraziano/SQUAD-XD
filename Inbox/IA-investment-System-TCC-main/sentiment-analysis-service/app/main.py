from fastapi import FastAPI, Query
from typing import Optional
from datetime import datetime, timedelta
from GoogleNews import GoogleNews
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Sentiment Analysis Service", version="2.0")
analyzer = SentimentIntensityAnalyzer()

# Mapping de símbolos crypto para termos de busca
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

def analyze_sentiment(text: str) -> dict:
    """Analisa sentimento com VADER."""
    scores = analyzer.polarity_scores(text)
    compound = scores['compound']

    if compound >= 0.05:
        label = "BULLISH"
    elif compound <= -0.05:
        label = "BEARISH"
    else:
        label = "NEUTRAL"

    return {
        "compound": round(compound, 4),
        "positive": round(scores['pos'], 4),
        "negative": round(scores['neg'], 4),
        "neutral": round(scores['neu'], 4),
        "label": label
    }

def fetch_crypto_news(symbol: str, days: int = 3):
    """Busca notícias recentes sobre a crypto."""
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

    articles = []
    for r in results[:20]:  # Limitar a 20
        title = r.get('title', '')
        desc = r.get('desc', '')
        text = f"{title}. {desc}" if desc else title

        sentiment = analyze_sentiment(text)

        articles.append({
            "title": title,
            "source": r.get('media', ''),
            "date": r.get('date', ''),
            "link": r.get('link', ''),
            "sentiment": sentiment
        })

    return articles


@app.get("/health")
def health():
    return {"status": "ok", "service": "sentiment-analysis"}

@app.get("/sentiment/analyze/")
def analyze(symbol: str = Query(..., description="Ex: BTCUSDT"), days: int = Query(3, le=7)):
    """Analisa sentimento de notícias recentes para um par crypto."""
    try:
        articles = fetch_crypto_news(symbol, days)

        if not articles:
            return {
                "symbol": symbol,
                "articles_count": 0,
                "overall_sentiment": "NEUTRAL",
                "average_score": 0,
                "articles": []
            }

        # Calcular sentimento médio
        scores = [a['sentiment']['compound'] for a in articles]
        avg_score = sum(scores) / len(scores)

        if avg_score >= 0.05:
            overall = "BULLISH"
        elif avg_score <= -0.05:
            overall = "BEARISH"
        else:
            overall = "NEUTRAL"

        bullish_count = sum(1 for s in scores if s >= 0.05)
        bearish_count = sum(1 for s in scores if s <= -0.05)
        neutral_count = len(scores) - bullish_count - bearish_count

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
    """Score rápido (-1 a 1) para integração com ML/trading."""
    result = analyze(symbol)
    return {
        "symbol": symbol,
        "score": result["average_score"],
        "sentiment": result["overall_sentiment"],
        "articles_analyzed": result["articles_count"]
    }
