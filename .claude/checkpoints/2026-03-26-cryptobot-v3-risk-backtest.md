---
date: 2026-03-26
title: "CryptoBot v3.0 — Risk Manager + Backtesting + Smart DCA"
branch: "master"
story: "CryptoBot Professional Trading Features"
tags: [crypto, risk-management, backtesting, dca, trading-bot, stop-loss, take-profit]
last_commit: "d43a3b1"
created_by: "orion"
---

## O que fizemos

Upgrade completo do CryptoBot de v2 para v3 com features profissionais de trading:

1. **Risk Manager** — Stop Loss, Take Profit, Trailing Stop, Position Sizing automatico (regra 2%), limites diarios
2. **Backtesting Engine** — 4 estrategias (ML Signal, RSI Mean Reversion, EMA Crossover, Smart DCA) com metricas completas
3. **Smart DCA Strategy** — Dollar Cost Averaging inteligente baseado em RSI
4. **Trading Bot v3** — Integrou risk manager + backtesting + novas rotas
5. **API Gateway v3** — Novas rotas para risco, backtest, config
6. **Frontend v3** — 3 abas (Dashboard, Backtesting, Gestao de Risco), equity curve chart
7. **README completo** — Guia passo a passo de como rodar

## Arquivos chave

- `trading-bot-service/app/risk_manager.py` — RiskManager, RiskConfig, Position (SL/TP/Trailing/Position Sizing)
- `trading-bot-service/app/backtesting.py` — BacktestEngine com 4 estrategias + metricas (Sharpe, Drawdown, PF)
- `trading-bot-service/app/main.py` — v3 com rotas de risco, backtest, strategies
- `api-gateway/main.py` — v3 com rotas de risco e backtest
- `front-end/index.html` — 3 abas: Dashboard, Backtesting, Gestao de Risco
- `front-end/script.js` — v3 com backtesting UI, risk config, equity chart
- `front-end/styles.css` — tabs, backtest form, risk config, position cards
- `README.md` — Guia completo de uso

## Decisoes tomadas

- **Ratio 1:2 default** (SL 3%, TP 6%) — padrao profissional
- **Position sizing via risk manager** — nunca arrisca mais que 2% por trade
- **4 estrategias de backtest** — cobrem diferentes perfis (agressivo a conservador)
- **Smart DCA com multiplicador RSI** — compra 3x quando oversold, skip quando overbought
- **In-memory state** — risk manager e backtesting rodam em memoria (suficiente para TCC/testnet)
- **Metricas profissionais** — Sharpe Ratio, Max Drawdown, Profit Factor, Win Rate

## Proximos passos

1. Criar conta Binance Testnet e configurar .env
2. docker-compose up --build
3. Acessar http://localhost:8080
4. Testar backtesting com diferentes estrategias
5. Configurar risco na aba "Gestao de Risco"
6. Rodar auto-trade
