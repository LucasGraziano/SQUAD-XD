---
date: 2026-03-26
title: "TCC Investment System — Migracao Completa para Crypto/Binance"
branch: "master"
story: "Brownfield TCC + Binance Migration"
tags: [crypto, binance, trading-bot, ml, sentiment, fullstack, tcc]
last_commit: "d43a3b1"
created_by: "orion"
---

## O que fizemos

Migracao completa do TCC Investment System de acoes (yfinance) para crypto (Binance API):
1. Reescrevemos o docker-compose.yml para 7 servicos (db, crypto-fetcher, ml, sentiment, trading-bot, api-gateway, frontend)
2. Criamos crypto-fetcher-service do zero (FastAPI + python-binance + PostgreSQL)
3. Atualizamos ml-prediction-service com novos indicadores (ATR, OBV, EMA, Bollinger Bands) e GridSearch otimizado
4. Implementamos sentiment-analysis-service do zero (VADER + GoogleNews scraping)
5. Criamos trading-bot-service com paper trading no Binance Testnet + auto-trade (ML + sentimento)
6. Reescrevemos api-gateway com rotas /api/ para todos os servicos
7. Reescrevemos frontend completo: dark theme dashboard com candlestick chart, ML signals, sentimento, trading controls, historico

## Estado atual

- **Backend:** 100% completo — todos os 6 servicos implementados
- **Frontend:** 100% completo — dashboard moderno com ApexCharts, dark theme, responsivo
- **Docker:** Pronto para `docker-compose up --build`
- **Pendente:** Usuario precisa criar conta Binance Testnet e configurar API keys no .env

## Arquivos chave

- `docker-compose.yml` — orquestracao dos 7 servicos
- `.env.example` — template de configuracao
- `crypto-fetcher-service/app/` — main.py, services.py, data/models.py, data/crud.py
- `ml-prediction-service/app/services/model.py` — Random Forest com 12+ features
- `ml-prediction-service/app/services/IndicadoresMercado.py` — RSI, MACD, ATR, OBV, BB, EMA
- `sentiment-analysis-service/app/main.py` — VADER + GoogleNews
- `trading-bot-service/app/main.py` — paper trading + auto-trade logic
- `api-gateway/main.py` — proxy para todos os servicos
- `front-end/index.html` — dashboard HTML
- `front-end/script.js` — logica do dashboard (API calls, charts, trading)
- `front-end/styles.css` — dark theme completo
- `front-end/Dockerfile` — nginx serving static files
- `front-end/nginx.conf` — proxy /api/ para api-gateway

## Decisoes tomadas

- **Crypto only** (sem acoes) — usuario escolheu foco 100% em crypto
- **Binance Testnet** para paper trading sem risco
- **VADER sentiment** (free) em vez de APIs pagas
- **In-memory trade history** no trading-bot (simplicidade, e TCC)
- **nginx reverse proxy** no frontend para evitar CORS issues em producao
- **GridSearch reduzido** (32 combinacoes vs 1152 original) para treinar rapido

## Proximos passos

1. Criar conta Binance Testnet (testnet.binance.vision)
2. Gerar API Key + Secret no Testnet
3. Copiar .env.example para .env e preencher credenciais
4. Rodar `docker-compose up --build`
5. Acessar dashboard em http://localhost:8080
6. Testar auto-trade com BTCUSDT
7. (Opcional) Adicionar mais pares, backtesting, alerts

## Contexto tecnico

- **Stack:** Python 3.11, FastAPI, PostgreSQL 13, nginx, Docker Compose
- **ML:** scikit-learn (Random Forest + GridSearchCV)
- **Crypto API:** python-binance (Testnet mode)
- **Sentiment:** vaderSentiment + GoogleNews
- **Charts:** ApexCharts (candlestick)
- **Frontend:** Vanilla JS, CSS Grid/Flexbox, dark theme
- **Porta padrao:** Frontend 8080, API Gateway 8000, servicos 8001-8004
