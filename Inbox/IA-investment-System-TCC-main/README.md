# CryptoBot v4.0 — Trading Bot com ML + Sentimento + Gestao de Risco

Sistema completo de trading automatizado para criptomoedas usando Machine Learning, analise de sentimento e gestao de risco profissional.

---

## Como Rodar (Passo a Passo)

### 1. Criar Conta na Binance Testnet

1. Acesse **https://testnet.binance.vision/**
2. Clique em **"Log In with GitHub"**
3. Depois de logado, clique em **"Generate HMAC_SHA256 Key"**
4. De um nome (ex: "CryptoBot") e clique em **"Generate"**
5. **COPIE** a API Key e o Secret Key (o secret so aparece 1 vez!)

### 2. Configurar o Projeto

```bash
cd IA-investment-System-TCC-main
```

Abra o arquivo `.env` e preencha com suas chaves:

```env
BINANCE_API_KEY=sua_api_key_aqui
BINANCE_SECRET_KEY=seu_secret_aqui
BINANCE_TESTNET=true

# Telegram (opcional — receber alertas de trades)
TELEGRAM_BOT_TOKEN=seu_token_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui
```

### 3. Subir o Sistema

```bash
docker-compose up --build
```

Primeira vez demora uns 3-5 minutos. Quando aparecer `uvicorn running on 0.0.0.0:8000` esta pronto!

### 4. Acessar o Dashboard

Abra no navegador: **http://localhost:8080**

---

## Novidades v4.0

| Feature | Descricao |
|---------|-----------|
| Cache ML com joblib | Modelo treinado 1x e cacheado — predict instantaneo |
| Metricas no test set | RMSE/MAE avaliados em dados nao vistos (deteccao de overfitting) |
| Persistencia de estado | Trades e posicoes salvos em disco — sobrevivem restarts |
| Scheduler SL/TP | Verificacao automatica a cada 30s (sem precisar clicar) |
| Singleton Binance | Client reutilizado (sem reconectar a cada request) |
| Retry com backoff | Chamadas entre servicos com 3 tentativas e backoff exponencial |
| Fallback sentiment | GoogleNews indisponivel → retorna NEUTRAL graciosamente |
| RSI Wilder's | Backtest usa RSI com EMA (padrao da industria) |
| Notificacoes Telegram | Alertas automaticos quando trades sao executados |
| Logging JSON | Logs estruturados para debug facil |
| Endpoint performance | Metricas reais (win rate, profit factor, P&L) |
| WebSocket prices | Stream de precos em tempo real via polling rapido |
| Health check global | `/health` mostra status de todos os servicos |
| Volumes Docker | Dados persistem entre `docker-compose down/up` |

---

## Como Usar

### Dashboard (aba principal)

1. **Selecionar par** — BTC, ETH, BNB, SOL, ADA
2. **ML Prediction** — Clique "Atualizar" (1a vez treina ~30s, depois instantaneo)
3. **Sentimento** — Analisa noticias recentes automaticamente
4. **Trading manual** — Preencha quantidade e clique COMPRAR ou VENDER
5. **Auto Trade** — ML + Sentimento + Risco decidem automaticamente
6. **Posicoes** — SL/TP verificados automaticamente a cada 30s

### Backtesting (aba "Backtesting")

| Estrategia | Melhor para |
|-----------|-------------|
| ML Signal | Tendencias claras |
| RSI Mean Reversion | Mercados laterais |
| EMA Crossover | Tendencia definida |
| Smart DCA | Longo prazo, menor risco |

Bons indicadores: Win Rate > 50%, Sharpe > 1, Max Drawdown < 20%, Profit Factor > 1.5

### Gestao de Risco (aba "Gestao de Risco")

| Parametro | Default | Funcao |
|-----------|---------|--------|
| Stop Loss | 3% | Vende se cair 3% |
| Take Profit | 6% | Vende se subir 6% (ratio 1:2) |
| Risco/Trade | 2% | Max 2% do capital por trade |
| Trailing Stop | 2% | Protege lucro se cair 2% do pico |
| Max Posicoes | 3 | Maximo 3 trades abertos |
| Max Trades/Dia | 10 | Limite diario |
| Max Perda/Dia | 5% | Para de operar se perder 5% |

### Telegram (opcional)

1. Fale com @BotFather no Telegram → crie um bot → copie o token
2. Fale com @userinfobot → copie seu chat_id
3. Coloque ambos no `.env`
4. Receba alertas automaticos quando o bot executar trades

---

## Arquitetura

```
                    +----------------+
                    |   Frontend     | :8080
                    |   (nginx)      |
                    +-------+--------+
                            |
                    +-------+--------+
                    |  API Gateway   | :8000
                    |  (FastAPI)     |
                    +-------+--------+
            +--------------++--------------+
            |              |               |
   +--------+----+  +------+------+  +-----+-------+
   |   Crypto    |  |    ML       |  | Sentiment   |
   |   Fetcher   |  | Prediction  |  |  Analysis   |
   |   :8001     |  |  :8002      |  |   :8003     |
   +------+------+  +------+------+  +-------------+
          |                |
   +------+------+  +------+------+
   | PostgreSQL  |  | Trading Bot |
   |   :5432     |  |    :8004    |
   +-----------+-+  +------+------+
               |           |
          [crypto_data]  [trading_state] [ml_models]  <-- Docker volumes
```

---

## API Endpoints

Todos via `http://localhost:8000/api/...`

### Crypto
- `GET /api/crypto/price/?symbol=BTCUSDT`
- `GET /api/crypto/ohlcv/?symbol=BTCUSDT`
- `GET /api/crypto/prices/live/` — Precos em cache do stream

### ML
- `GET /api/ml/predict/?symbol=BTCUSDT` — Predicao rapida (cacheada)
- `GET /api/ml/train/?symbol=BTCUSDT` — Treinar modelo completo
- `GET /api/ml/status/` — Status dos modelos cacheados

### Sentiment
- `GET /api/sentiment/analyze/?symbol=BTCUSDT`
- `GET /api/sentiment/score/?symbol=BTCUSDT`

### Trading
- `POST /api/trading/execute/?symbol=BTCUSDT&side=BUY`
- `POST /api/trading/auto/?symbol=BTCUSDT`
- `GET /api/trading/performance/` — Metricas reais
- `GET /api/trading/risk/`
- `POST /api/trading/risk/config/?stop_loss=0.03`
- `POST /api/trading/backtest/?strategy=rsi_mean_reversion`
- `GET /api/trading/balance/`
- `GET /api/trading/history/`

### Health
- `GET /health` — Status de todos os servicos

---

## Stack

- **Backend:** Python 3.11, FastAPI, SQLAlchemy
- **ML:** scikit-learn (Random Forest + GridSearchCV + TimeSeriesSplit)
- **Indicadores:** RSI, MACD, Stochastic RSI, ATR, OBV, EMA, Bollinger Bands
- **Sentimento:** VADER + GoogleNews (com fallback gracioso)
- **Crypto API:** python-binance (Testnet/Production)
- **Frontend:** HTML/CSS/JS, ApexCharts, WebSocket
- **Infra:** Docker Compose, PostgreSQL 13, nginx
- **Notificacoes:** Telegram Bot API
- **Persistencia:** Docker volumes + JSON state files

---

## Comandos

```bash
docker-compose up --build          # Subir tudo
docker-compose up -d --build       # Background
docker-compose logs -f trading-bot-service  # Logs do bot
docker-compose down                # Parar
docker-compose down -v             # Parar + limpar dados
```
