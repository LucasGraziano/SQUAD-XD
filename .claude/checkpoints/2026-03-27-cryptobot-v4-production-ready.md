---
date: 2026-03-27
title: "CryptoBot v4.0 — Production-Ready com ML Cache, Persistencia, Alertas e Performance"
branch: "master"
story: "CryptoBot Evolution — TCC to Production"
tags: [crypto, binance, trading-bot, ml, sentiment, risk-management, backtesting, production, telegram, websocket, persistence]
last_commit: "d43a3b1"
created_by: "orion"
---

## O que fizemos

### Sessao: Upgrade v3 → v4 (18 melhorias implementadas)

**Auditoria completa** do codigo v3 identificou 15 problemas/melhorias. Todos implementados:

#### Criticos (impactam lucro/seguranca)
1. **ML predict separado de train** — `/predict` agora usa modelo cacheado (instantaneo), `/train` so quando necessario
2. **Metricas no test set** — Split 80/20 temporal, deteccao de overfitting (overfit_ratio)
3. **Cache ML com joblib** — Modelo salvo em disco + memoria, sobrevive restarts
4. **Persistencia de estado** — `state_store.py`: trades, posicoes, daily state salvos em JSON
5. **Scheduler SL/TP automatico** — APScheduler verifica posicoes a cada 30s

#### Importantes (confiabilidade)
6. **Singleton Binance client** — Reutiliza conexao em vez de criar nova a cada request
7. **Retry com backoff exponencial** — 3 tentativas com backoff (1s, 2s, 4s) entre servicos
8. **Fallback gracioso do sentiment** — GoogleNews falha → retorna NEUTRAL silenciosamente
9. **RSI com Wilder's smoothing** — Backtest agora usa RSI padrao da industria (EMA, nao SMA)
10. **Rate limiting via singleton** — Client unico evita excesso de requests na Binance

#### Extras implementados
11. **Notificacoes Telegram** — `notifier.py`: alertas automaticos em trades e fechamentos
12. **Logging JSON estruturado** — Todos os servicos com formato JSON para debug
13. **Endpoint `/trading/performance/`** — Win rate, profit factor, P&L real (nao backtest)
14. **WebSocket prices** — `ws_manager.py`: stream de precos via polling rapido (5s)
15. **Health check global** — `/health` mostra status de todos os 4 servicos

#### Melhorias extras (v4 bonus)
16. **Scheduler retrain ML diario** — APScheduler retreina modelos automaticamente as 2h UTC
17. **Endpoints `/ml/retrain/` e `/ml/retrain-all/`** — Retrain sob demanda
18. **Frontend aba Performance** — Win rate, profit factor, P&L, status dos modelos ML e servicos

## Estado atual

- **Sistema v4.0 completo** — todas as 18 melhorias implementadas
- **Docker Compose atualizado** — 3 volumes para persistencia (crypto_data, ml_models, trading_state)
- **README v4.0** — documentacao completa atualizada
- **NAO commitado** — mudancas em `Inbox/IA-investment-System-TCC-main/`
- **Docker nao funciona ainda** — virtualizacao desabilitada na BIOS

## Arquivos criados/modificados

### Novos
- `trading-bot-service/app/state_store.py` — Persistencia JSON
- `trading-bot-service/app/notifier.py` — Telegram notifications
- `crypto-fetcher-service/app/ws_manager.py` — WebSocket price manager

### Modificados
- `ml-prediction-service/app/services/model.py` — Cache joblib, test set metrics, predict separado
- `ml-prediction-service/app/main.py` — Scheduler retrain, endpoints retrain
- `ml-prediction-service/requirements.txt` — +joblib, +apscheduler
- `trading-bot-service/app/main.py` — Scheduler SL/TP, singleton, retry, performance endpoint
- `trading-bot-service/app/risk_manager.py` — Persistencia integrada
- `trading-bot-service/app/backtesting.py` — RSI Wilder's smoothing
- `trading-bot-service/requirements.txt` — +apscheduler
- `sentiment-analysis-service/app/main.py` — Fallback gracioso
- `api-gateway/main.py` — Proxy simplificado, health global, novos endpoints
- `crypto-fetcher-service/app/main.py` — WebSocket endpoint, logging JSON
- `docker-compose.yml` — 3 volumes persistentes, envs Telegram/ML
- `front-end/index.html` — Aba Performance, badge de status
- `front-end/script.js` — loadPerformance, loadMLStatus, loadServicesHealth
- `.env` — Variaveis Telegram adicionadas
- `README.md` — Documentacao v4.0 completa

## Decisoes tomadas

- Polling 5s em vez de Binance WebSocket nativo (Testnet nao suporta WS confiavelmente)
- Retrain diario as 2h UTC (mercado crypto e 24/7, 2h UTC e horario de menor volume)
- JSON file para state em vez de banco (simples, suficiente para o caso de uso)
- RSI Wilder's no backtest mas mantive SMA no IndicadoresMercado.py (consistencia com treino ML)
- Fallback NEUTRAL no sentiment em vez de bloquear operacao

## Proximos passos

1. **BIOS** — Habilitar virtualizacao (Intel VT-x / AMD SVM)
2. **Docker Desktop** — Instalar e verificar que funciona
3. **Binance Testnet** — Gerar chaves em https://testnet.binance.vision/
4. **Editar .env** — Colar API Key + Secret Key
5. **`docker-compose up --build`** — Subir tudo
6. **http://localhost:8080** — Testar dashboard
7. **Adicionar par** — BTCUSDT via `/api/crypto/add-pair/`
8. **Rodar backtest** — Validar estrategias nos dados reais
9. **(Opcional)** Configurar Telegram para alertas
10. **(Futuro v5)** Ensemble ML (XGBoost + LSTM), multi-timeframe, Fear & Greed Index

## Contexto tecnico

- **Stack:** Python 3.11, FastAPI, PostgreSQL 13, nginx, Docker Compose
- **ML:** scikit-learn (RandomForest + GridSearchCV + TimeSeriesSplit) + joblib cache
- **Indicadores:** RSI, Stochastic RSI, MACD, ATR, OBV, EMA(7/21), Bollinger Bands
- **Sentiment:** VADER + GoogleNews (com fallback gracioso)
- **Crypto API:** python-binance (Testnet mode)
- **Charts:** ApexCharts (candlestick + area/equity)
- **Notificacoes:** Telegram Bot API (opcional)
- **Frontend:** Vanilla JS, CSS Grid/Flexbox, dark theme, 4 abas
- **Portas:** Frontend 8080, API Gateway 8000, servicos 8001-8004, PostgreSQL 5432
- **Volumes Docker:** crypto_data, ml_models, trading_state
- **Schedulers:** SL/TP check (30s), ML retrain (diario 2h UTC), OHLCV update (meia-noite UTC)
