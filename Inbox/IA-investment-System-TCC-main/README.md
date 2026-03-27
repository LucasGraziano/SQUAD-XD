# CryptoBot — Trading Bot com ML + Sentimento + Gestao de Risco

Sistema completo de trading automatizado para criptomoedas usando Machine Learning, analise de sentimento e gestao de risco profissional.

**Testnet only** — roda na Binance Testnet (paper trading), sem risco de perder dinheiro real.

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
# Entrar na pasta do projeto
cd IA-investment-System-TCC-main

# Copiar o arquivo de exemplo
cp .env.example .env
```

Abra o arquivo `.env` e preencha com suas chaves:

```env
# Cole suas chaves da Binance Testnet aqui
BINANCE_API_KEY=sua_api_key_aqui
BINANCE_SECRET_KEY=seu_secret_aqui
BINANCE_TESTNET=true

# Banco de dados (pode deixar assim)
POSTGRES_USER=cryptouser
POSTGRES_PASSWORD=cryptopass123
POSTGRES_DB=cryptodb

# Par padrao
DEFAULT_SYMBOL=BTCUSDT
```

### 3. Subir o Sistema

```bash
# Subir todos os 7 servicos
docker-compose up --build
```

Primeira vez demora uns 3-5 minutos pra baixar as imagens e instalar dependencias.

Quando aparecer algo tipo `uvicorn running on 0.0.0.0:8000` em varios servicos, esta pronto!

### 4. Acessar o Dashboard

Abra no navegador: **http://localhost:8080**

Voce vai ver o dashboard com:
- Grafico de candlestick
- Preco em tempo real
- Painel de ML e Sentimento
- Controles de trading

---

## Como Usar

### Dashboard (aba principal)

1. **Selecionar par** — No canto superior direito, escolha o par (BTC, ETH, BNB, SOL, ADA)
2. **Ver ML** — Clique "Atualizar" no painel ML para ver a previsao (demora ~30s, treina o modelo)
3. **Ver Sentimento** — Clique "Atualizar" para analisar noticias recentes
4. **Trading manual** — Preencha a quantidade e clique COMPRAR ou VENDER
5. **Auto Trade** — Clique "AUTO TRADE" para deixar o bot decidir baseado em ML + Sentimento + Risco
6. **Verificar Posicoes** — Clique para checar se algum SL/TP foi atingido

### Backtesting (aba "Backtesting")

Simula como uma estrategia teria performado nos ultimos 365 dias:

1. Escolha a **estrategia**:
   - **ML Signal** — Segue as previsoes do modelo Random Forest
   - **RSI Mean Reversion** — Compra quando RSI < 30, vende quando RSI > 70
   - **EMA Crossover** — Segue cruzamento de medias moveis
   - **Smart DCA** — Dollar Cost Averaging inteligente (compra mais quando esta barato)

2. Configure: capital inicial, stop loss, take profit, risco por trade
3. Clique **"RODAR BACKTEST"**
4. Analise os resultados:
   - **Win Rate > 50%** = bom
   - **Sharpe > 1** = muito bom
   - **Max Drawdown < 20%** = risco aceitavel
   - **Profit Factor > 1.5** = lucrativo

### Gestao de Risco (aba "Gestao de Risco")

Configure as regras de protecao:

| Parametro | Default | O que faz |
|-----------|---------|-----------|
| Stop Loss | 3% | Vende automatico se cair 3% |
| Take Profit | 6% | Vende automatico se subir 6% |
| Risco por Trade | 2% | Nunca arrisca mais que 2% do capital |
| Trailing Stop | 2% | Protege lucro se cair 2% do pico |
| Max Posicoes | 3 | No maximo 3 trades abertos |
| Max Trades/Dia | 10 | No maximo 10 trades por dia |
| Max Perda/Dia | 5% | Para de operar se perder 5% no dia |

---

## Arquitetura

```
                    ┌──────────────┐
                    │   Frontend   │ :8080
                    │  (nginx)     │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │  API Gateway │ :8000
                    │  (FastAPI)   │
                    └──────┬───────┘
            ┌──────────────┼──────────────┐
            │              │              │
   ┌────────┴────┐  ┌─────┴─────┐  ┌─────┴──────┐
   │   Crypto    │  │    ML     │  │ Sentiment  │
   │   Fetcher   │  │ Predict.  │  │  Analysis  │
   │   :8001     │  │  :8002    │  │   :8003    │
   └──────┬──────┘  └───────────┘  └────────────┘
          │
   ┌──────┴──────┐        ┌──────────────┐
   │ PostgreSQL  │        │ Trading Bot  │
   │   :5432     │        │    :8004     │
   └─────────────┘        └──────────────┘
```

| Servico | Porta | Funcao |
|---------|-------|--------|
| frontend | 8080 | Dashboard web |
| api-gateway | 8000 | Roteamento de APIs |
| crypto-fetcher | 8001 | Dados OHLCV da Binance |
| ml-prediction | 8002 | Random Forest + indicadores tecnicos |
| sentiment-analysis | 8003 | VADER + GoogleNews |
| trading-bot | 8004 | Execucao de trades + risco + backtest |
| crypto-db | 5432 | PostgreSQL para dados historicos |

---

## Comandos Uteis

```bash
# Subir tudo
docker-compose up --build

# Subir em background
docker-compose up -d --build

# Ver logs de um servico especifico
docker-compose logs -f trading-bot-service

# Parar tudo
docker-compose down

# Parar e limpar dados do banco
docker-compose down -v

# Reconstruir um servico especifico
docker-compose build trading-bot-service
docker-compose up -d trading-bot-service
```

## API Endpoints

Todos acessiveis via `http://localhost:8000/api/...`

### Crypto Fetcher
- `GET /api/crypto/price/?symbol=BTCUSDT` — Preco atual
- `GET /api/crypto/ohlcv/?symbol=BTCUSDT&interval=1d&limit=100` — Dados historicos

### ML Prediction
- `GET /api/ml/predict/?symbol=BTCUSDT` — Sinal de compra/venda
- `GET /api/ml/train/?symbol=BTCUSDT` — Treinar modelo completo

### Sentiment
- `GET /api/sentiment/analyze/?symbol=BTCUSDT` — Analise completa com artigos
- `GET /api/sentiment/score/?symbol=BTCUSDT` — Score rapido

### Trading Bot
- `POST /api/trading/execute/?symbol=BTCUSDT&side=BUY` — Trade manual (position sizing auto)
- `POST /api/trading/auto/?symbol=BTCUSDT` — Auto trade (ML + sentimento + risco)
- `POST /api/trading/backtest/?strategy=rsi_mean_reversion` — Backtest
- `GET /api/trading/risk/` — Status do risk manager
- `POST /api/trading/risk/config/?stop_loss=0.03` — Configurar risco
- `POST /api/trading/risk/check-positions/` — Verificar SL/TP
- `GET /api/trading/balance/` — Saldo da conta
- `GET /api/trading/history/` — Historico de trades
- `GET /api/trading/backtest/strategies/` — Listar estrategias

---

## Stack Tecnica

- **Backend:** Python 3.11, FastAPI, SQLAlchemy
- **ML:** scikit-learn (Random Forest + GridSearchCV)
- **Indicadores:** RSI, MACD, Stochastic RSI, ATR, OBV, EMA, Bollinger Bands
- **Sentimento:** VADER + GoogleNews
- **Crypto API:** python-binance (Testnet)
- **Frontend:** HTML/CSS/JS, ApexCharts
- **Infra:** Docker Compose, PostgreSQL 13, nginx

---

## Estrategias de Trading

### 1. ML Signal (Random Forest)
Usa 18 features (indicadores tecnicos) para prever o preco de fechamento do proximo candle.
Se previu subida → BUY. Se previu queda → SELL. Combina com sentimento.

### 2. RSI Mean Reversion
Quando RSI < 30, o ativo esta "oversold" (venderam demais) → compra.
Quando RSI > 70, esta "overbought" (compraram demais) → vende.
Funciona melhor em mercados laterais.

### 3. EMA Crossover (7/21)
Quando a media rapida (7 periodos) cruza acima da lenta (21) → compra.
Quando cruza abaixo → vende. Classico trend-following.

### 4. Smart DCA
Compra periodicamente, mas ajusta o valor:
- RSI < 30: compra **3x** o normal (medo = oportunidade)
- RSI 30-40: compra **2x**
- RSI 40-60: compra **1x** (normal)
- RSI > 60: **pula** (sobrecomprado)

Menor risco, melhor para longo prazo.
