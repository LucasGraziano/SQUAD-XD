// === CryptoBot Dashboard v3.0 — Frontend ===

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api'
    : '/api';

let chart = null;
let equityChart = null;
let currentSymbol = 'BTCUSDT';
let currentInterval = '1h';
let refreshTimer = null;

// === Init ===

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initEventListeners();
    initChart();
    loadAll();
    startAutoRefresh();
});

// === Tabs ===

function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');

            if (tab.dataset.tab === 'risk') loadRiskStatus();
        });
    });
}

// === Event Listeners ===

function initEventListeners() {
    document.getElementById('pair-select').addEventListener('change', (e) => {
        currentSymbol = e.target.value;
        loadAll();
    });

    document.querySelectorAll('.btn-interval').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.btn-interval.active').classList.remove('active');
            btn.classList.add('active');
            currentInterval = btn.dataset.interval;
            loadChartData();
        });
    });

    document.getElementById('btn-predict').addEventListener('click', loadMLPrediction);
    document.getElementById('btn-sentiment').addEventListener('click', loadSentiment);
    document.getElementById('btn-refresh-history').addEventListener('click', loadHistory);
    document.getElementById('btn-buy').addEventListener('click', () => executeTrade('BUY'));
    document.getElementById('btn-sell').addEventListener('click', () => executeTrade('SELL'));
    document.getElementById('btn-auto').addEventListener('click', executeAutoTrade);
    document.getElementById('btn-check-positions').addEventListener('click', checkPositions);

    // Backtest
    document.getElementById('btn-run-backtest').addEventListener('click', runBacktest);

    // Risk
    document.getElementById('btn-save-risk').addEventListener('click', saveRiskConfig);
    document.getElementById('btn-refresh-risk').addEventListener('click', loadRiskStatus);
}

function startAutoRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(() => {
        loadPrice();
        loadBotStatus();
    }, 15000);
}

function loadAll() {
    loadChartData();
    loadPrice();
    loadBalance();
    loadBotStatus();
    loadMLPrediction();
    loadSentiment();
    loadHistory();
}

// === API Helper ===

async function api(path, options = {}) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: { 'Content-Type': 'application/json', ...options.headers }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(err.detail || `HTTP ${res.status}`);
        }
        return await res.json();
    } catch (err) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            throw new Error('Servico indisponivel — verifique se o Docker esta rodando');
        }
        throw err;
    }
}

// === Chart ===

function initChart() {
    const options = {
        series: [{ data: [] }],
        chart: {
            type: 'candlestick', height: 400, background: 'transparent',
            toolbar: { show: true, tools: { download: false } },
            zoom: { enabled: true }
        },
        theme: { mode: 'dark' },
        grid: { borderColor: '#30363d', strokeDashArray: 2 },
        plotOptions: { candlestick: { colors: { upward: '#3fb950', downward: '#f85149' } } },
        xaxis: {
            type: 'datetime',
            labels: { style: { colors: '#8b949e' } },
            axisBorder: { color: '#30363d' }, axisTicks: { color: '#30363d' }
        },
        yaxis: {
            labels: {
                style: { colors: '#8b949e' },
                formatter: (v) => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            },
            tooltip: { enabled: true }
        },
        tooltip: { theme: 'dark' }
    };
    chart = new ApexCharts(document.querySelector('#candlestick-chart'), options);
    chart.render();
}

async function loadChartData() {
    try {
        const data = await api(`/crypto/ohlcv/?symbol=${currentSymbol}&interval=${currentInterval}&limit=200`);
        if (data && Array.isArray(data)) {
            const series = data.map(d => ({
                x: new Date(d.timestamp || d.date),
                y: [d.open, d.high, d.low, d.close]
            }));
            chart.updateSeries([{ data: series }]);
        }
    } catch (err) { console.error('Chart error:', err); }
}

// === Price ===

async function loadPrice() {
    try {
        const data = await api(`/crypto/price/?symbol=${currentSymbol}`);
        const price = parseFloat(data.price || data.current_price || 0);
        document.getElementById('current-price').textContent = '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch { document.getElementById('current-price').textContent = '--'; }
}

// === Balance ===

async function loadBalance() {
    try {
        const data = await api('/trading/balance/');
        const usdt = data.balances?.find(b => b.asset === 'USDT');
        document.getElementById('balance-usdt').textContent = usdt ? '$' + usdt.total.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '$0.00';
    } catch { document.getElementById('balance-usdt').textContent = '--'; }
}

// === Bot Status ===

async function loadBotStatus() {
    try {
        const data = await api('/trading/status/');
        document.getElementById('total-trades').textContent = data.total_trades || 0;

        const pnlEl = document.getElementById('pnl');
        const pnl = data.estimated_pnl_usdt || 0;
        pnlEl.textContent = (pnl >= 0 ? '+' : '') + '$' + pnl.toFixed(2);
        pnlEl.className = 'kpi-value ' + (pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : 'neutral');

        const rm = data.risk_manager || {};
        document.getElementById('open-positions').textContent = rm.open_positions || 0;
    } catch {}
}

// === ML Prediction ===

async function loadMLPrediction() {
    const btn = document.getElementById('btn-predict');
    btn.innerHTML = '<span class="loading"></span>';
    btn.disabled = true;

    try {
        const data = await api(`/ml/predict/?symbol=${currentSymbol}`);
        const signal = (data.signal || 'HOLD').toUpperCase();
        const signalEl = document.getElementById('ml-signal');
        signalEl.textContent = signal;
        signalEl.className = 'signal-badge ' + signal.toLowerCase();

        const confidence = data.confidence || 0;
        document.getElementById('ml-confidence-bar').style.width = Math.min(confidence, 100) + '%';
        document.getElementById('ml-confidence-text').textContent = confidence.toFixed(1) + '%';

        const metricsEl = document.getElementById('ml-metrics');
        metricsEl.innerHTML = [
            { label: 'Preco Atual', value: data.current_close ? '$' + parseFloat(data.current_close).toFixed(2) : '--' },
            { label: 'Preco Pred.', value: data.predicted_close ? '$' + parseFloat(data.predicted_close).toFixed(2) : '--' },
        ].map(m => `<div class="metric-item"><span class="metric-label">${m.label}</span><span class="metric-value">${m.value}</span></div>`).join('');

    } catch (err) {
        document.getElementById('ml-signal').textContent = 'ERRO';
        document.getElementById('ml-signal').className = 'signal-badge hold';
        showToast('ML: ' + err.message, 'error');
    } finally {
        btn.textContent = 'Atualizar';
        btn.disabled = false;
    }
}

// === Sentiment ===

async function loadSentiment() {
    const btn = document.getElementById('btn-sentiment');
    btn.innerHTML = '<span class="loading"></span>';
    btn.disabled = true;

    try {
        const data = await api(`/sentiment/analyze/?symbol=${currentSymbol}`);
        const score = data.overall_score || data.score || 0;
        const sentiment = data.overall_sentiment || data.sentiment || 'NEUTRAL';

        const emojiMap = { 'BULLISH': '🟢', 'VERY_BULLISH': '🟢', 'BEARISH': '🔴', 'VERY_BEARISH': '🔴', 'NEUTRAL': '🟡' };
        document.getElementById('sentiment-emoji').textContent = emojiMap[sentiment] || '🟡';
        document.getElementById('sentiment-label').textContent = sentiment;

        const scoreEl = document.getElementById('sentiment-score');
        scoreEl.textContent = score.toFixed(3);
        scoreEl.style.color = score > 0.05 ? '#3fb950' : score < -0.05 ? '#f85149' : '#8b949e';

        const articlesEl = document.getElementById('sentiment-articles');
        const articles = data.articles || [];
        articlesEl.innerHTML = articles.length === 0
            ? '<div class="article-item neutral">Nenhum artigo encontrado</div>'
            : articles.slice(0, 5).map(a => {
                const cls = a.sentiment === 'Positive' ? 'positive' : a.sentiment === 'Negative' ? 'negative' : 'neutral';
                return `<div class="article-item ${cls}">${a.title || a.headline || 'Artigo'}</div>`;
            }).join('');

    } catch (err) {
        document.getElementById('sentiment-label').textContent = 'Indisponivel';
        document.getElementById('sentiment-emoji').textContent = '--';
    } finally {
        btn.textContent = 'Atualizar';
        btn.disabled = false;
    }
}

// === Trading ===

async function executeTrade(side) {
    const qtyInput = document.getElementById('trade-qty');
    const qty = qtyInput.value ? parseFloat(qtyInput.value) : null;

    const btn = side === 'BUY' ? document.getElementById('btn-buy') : document.getElementById('btn-sell');
    btn.innerHTML = '<span class="loading"></span>';
    disableTradeButtons(true);

    try {
        let url = `/trading/execute/?symbol=${currentSymbol}&side=${side}&use_risk_manager=true`;
        if (qty) url += `&quantity=${qty}`;

        const data = await api(url, { method: 'POST' });

        if (data.blocked) {
            showTradeResult('info', `BLOQUEADO: ${data.reasons.join(', ')}`);
            showToast('Trade bloqueado pelo Risk Manager', 'info');
            return;
        }

        showTradeResult('success',
            `<strong>${side}</strong> ${data.quantity} ${currentSymbol} @ $${data.avg_price}<br>` +
            `Total: $${data.total_value} | Order #${data.order_id}`
        );
        showToast(`Trade executado: ${side} ${data.quantity} ${currentSymbol}`, 'success');
        loadBalance(); loadBotStatus(); loadHistory();

    } catch (err) {
        showTradeResult('error', 'Erro: ' + err.message);
        showToast('Erro no trade: ' + err.message, 'error');
    } finally {
        btn.textContent = side === 'BUY' ? 'COMPRAR' : 'VENDER';
        disableTradeButtons(false);
    }
}

async function executeAutoTrade() {
    const btn = document.getElementById('btn-auto');
    btn.innerHTML = '<span class="loading"></span> Analisando...';
    disableTradeButtons(true);

    try {
        const data = await api(`/trading/auto/?symbol=${currentSymbol}`, { method: 'POST' });

        let html = `<strong>Decisao: ${data.decision}</strong><br>`;
        html += `ML: ${data.ml_signal} (${data.ml_confidence}%) | Sentimento: ${data.sentiment} (${data.sentiment_score})<br>`;
        html += `<small>${data.reasoning?.join(' | ') || ''}</small>`;

        if (data.position_size) {
            html += `<br><small>Capital: $${data.position_size.capital} | Risco: $${data.position_size.risk_amount} | Qty: ${data.position_size.quantity}</small>`;
        }

        if (data.trade_executed) {
            html += `<br><strong style="color:#3fb950">Trade executado!</strong> ${data.trade_executed.side} ${data.trade_executed.quantity} @ $${data.trade_executed.avg_price}`;
            showToast(`Auto trade: ${data.decision} executado!`, 'success');
            loadBalance(); loadBotStatus(); loadHistory();
        } else if (data.decision === 'BLOCKED') {
            showToast('Trade bloqueado pelo Risk Manager', 'info');
        } else if (data.trade_error) {
            html += `<br><span style="color:#f85149">Erro: ${data.trade_error}</span>`;
        }

        showTradeResult(data.trade_executed ? 'success' : 'info', html);

    } catch (err) {
        showToast('Erro: ' + err.message, 'error');
    } finally {
        btn.textContent = 'AUTO TRADE (ML + Sentimento + Risco)';
        disableTradeButtons(false);
    }
}

async function checkPositions() {
    const btn = document.getElementById('btn-check-positions');
    btn.innerHTML = '<span class="loading"></span> Verificando...';
    btn.disabled = true;

    try {
        const data = await api('/trading/risk/check-positions/', { method: 'POST' });
        const actions = data.actions || [];

        if (actions.length === 0) {
            showTradeResult('info', 'Nenhuma posicao aberta para verificar');
        } else {
            const html = actions.map(a => {
                const color = a.action === 'HOLD' ? '#8b949e' :
                              a.action.includes('TP') ? '#3fb950' : '#f85149';
                return `<div style="color:${color}"><strong>${a.action}</strong> ${a.symbol} | ${a.reason || 'P&L: ' + a.pnl_pct + '%'}</div>`;
            }).join('');
            showTradeResult('info', html);

            if (actions.some(a => a.action !== 'HOLD')) {
                loadBalance(); loadBotStatus(); loadHistory();
            }
        }
    } catch (err) {
        showToast('Erro: ' + err.message, 'error');
    } finally {
        btn.textContent = 'VERIFICAR POSICOES (SL/TP)';
        btn.disabled = false;
    }
}

// === History ===

async function loadHistory() {
    try {
        const data = await api('/trading/history/');
        const tbody = document.getElementById('history-body');

        if (!data.trades || data.trades.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Nenhum trade realizado</td></tr>';
            return;
        }

        tbody.innerHTML = data.trades.slice().reverse().map(t => `
            <tr>
                <td>${new Date(t.timestamp).toLocaleString('pt-BR')}</td>
                <td>${t.symbol}</td>
                <td class="side-${t.side.toLowerCase()}">${t.side}</td>
                <td>${t.quantity}</td>
                <td>$${t.avg_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>$${t.total_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>${t.status}</td>
            </tr>
        `).join('');
    } catch {}
}

// === Backtesting ===

async function runBacktest() {
    const btn = document.getElementById('btn-run-backtest');
    btn.innerHTML = '<span class="loading"></span> Rodando backtest...';
    btn.disabled = true;

    try {
        const strategy = document.getElementById('bt-strategy').value;
        const capital = document.getElementById('bt-capital').value;
        const sl = document.getElementById('bt-sl').value / 100;
        const tp = document.getElementById('bt-tp').value / 100;
        const risk = document.getElementById('bt-risk').value / 100;

        const data = await api(
            `/trading/backtest/?symbol=${currentSymbol}&strategy=${strategy}` +
            `&initial_capital=${capital}&stop_loss=${sl}&take_profit=${tp}&risk_per_trade=${risk}`,
            { method: 'POST' }
        );

        if (data.error) {
            showToast('Backtest: ' + data.error, 'error');
            return;
        }

        document.getElementById('backtest-results').classList.remove('hidden');

        // KPIs
        const pnl = data.total_pnl || 0;
        const pnlEl = document.getElementById('bt-pnl');
        pnlEl.textContent = (pnl >= 0 ? '+' : '') + '$' + pnl.toFixed(2) + ` (${data.total_pnl_pct || 0}%)`;
        pnlEl.className = 'kpi-value ' + (pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : 'neutral');

        document.getElementById('bt-winrate').textContent = (data.win_rate || 0) + '%';
        document.getElementById('bt-winrate').className = 'kpi-value ' + ((data.win_rate || 0) > 50 ? 'positive' : 'negative');

        const dd = document.getElementById('bt-drawdown');
        dd.textContent = (data.max_drawdown || 0) + '%';
        dd.className = 'kpi-value negative';

        const sharpe = document.getElementById('bt-sharpe');
        sharpe.textContent = data.sharpe_ratio || 0;
        sharpe.className = 'kpi-value ' + ((data.sharpe_ratio || 0) > 1 ? 'positive' : (data.sharpe_ratio || 0) > 0 ? 'neutral' : 'negative');

        // Detailed metrics
        const detailsEl = document.getElementById('bt-details');
        const metrics = [
            ['Estrategia', strategy],
            ['Periodo', data.period || '--'],
            ['Capital Inicial', '$' + (data.initial_capital || capital)],
            ['Capital Final', '$' + (data.final_capital || '--')],
            ['Total Trades', data.total_trades || 0],
            ['Trades Vencedores', data.winning_trades || 0],
            ['Trades Perdedores', data.losing_trades || 0],
            ['Media Ganho', '$' + (data.avg_win || 0)],
            ['Media Perda', '$' + (data.avg_loss || 0)],
            ['Risk/Reward', data.risk_reward_ratio || '--'],
            ['Profit Factor', data.profit_factor || '--'],
            ['Melhor Trade', '$' + (data.best_trade || 0)],
            ['Pior Trade', '$' + (data.worst_trade || 0)],
        ];
        detailsEl.innerHTML = metrics.map(([label, value]) =>
            `<div class="bt-detail-item"><span class="bt-detail-label">${label}</span><span class="bt-detail-value">${value}</span></div>`
        ).join('');

        // Exit reasons
        const exitEl = document.getElementById('bt-exit-reasons');
        const exits = data.exit_reasons || {};
        const exitLabels = {
            'stop_loss': 'Stop Loss', 'take_profit': 'Take Profit',
            'signal_change': 'Mudanca de Sinal', 'end_of_data': 'Fim dos Dados',
            'rsi_overbought': 'RSI Overbought', 'ema_cross_down': 'EMA Cruzou'
        };
        exitEl.innerHTML = Object.entries(exits).map(([k, v]) =>
            `<div class="bt-detail-item"><span class="bt-detail-label">${exitLabels[k] || k}</span><span class="bt-detail-value">${v}</span></div>`
        ).join('');

        // Equity curve chart
        if (data.equity_curve) {
            renderEquityCurve(data.equity_curve);
        }

        // Trades table
        const tbody = document.getElementById('bt-trades-body');
        const trades = data.trades || [];
        tbody.innerHTML = trades.length === 0
            ? '<tr><td colspan="7" class="empty-state">Nenhum trade</td></tr>'
            : trades.slice().reverse().map(t => `
                <tr>
                    <td>${t.entry_date || '--'}</td>
                    <td>${t.exit_date || '--'}</td>
                    <td class="side-${(t.side || '').toLowerCase()}">${t.side || '--'}</td>
                    <td>$${(t.entry_price || 0).toFixed(2)}</td>
                    <td>$${(t.exit_price || 0).toFixed(2)}</td>
                    <td style="color:${t.pnl >= 0 ? '#3fb950' : '#f85149'}">${t.pnl >= 0 ? '+' : ''}$${(t.pnl || 0).toFixed(2)} (${t.pnl_pct || 0}%)</td>
                    <td>${exitLabels[t.exit_reason] || t.exit_reason || '--'}</td>
                </tr>
            `).join('');

        showToast('Backtest concluido!', 'success');

    } catch (err) {
        showToast('Erro no backtest: ' + err.message, 'error');
    } finally {
        btn.textContent = 'RODAR BACKTEST';
        btn.disabled = false;
    }
}

function renderEquityCurve(equityCurve) {
    const el = document.getElementById('equity-chart');
    el.innerHTML = '';

    const options = {
        series: [{ name: 'Equity', data: equityCurve.map((v, i) => [i, Math.round(v * 100) / 100]) }],
        chart: { type: 'area', height: 350, background: 'transparent', toolbar: { show: false } },
        theme: { mode: 'dark' },
        colors: [equityCurve[equityCurve.length - 1] >= equityCurve[0] ? '#3fb950' : '#f85149'],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
        stroke: { width: 2 },
        grid: { borderColor: '#30363d', strokeDashArray: 2 },
        xaxis: { labels: { show: false }, axisBorder: { show: false } },
        yaxis: {
            labels: {
                style: { colors: '#8b949e' },
                formatter: (v) => '$' + v.toLocaleString('en-US', { maximumFractionDigits: 0 })
            }
        },
        tooltip: { theme: 'dark', y: { formatter: (v) => '$' + v.toFixed(2) } }
    };

    equityChart = new ApexCharts(el, options);
    equityChart.render();
}

// === Risk Management ===

async function loadRiskStatus() {
    try {
        const data = await api('/trading/risk/');

        // Update form with current values
        const cfg = data.config || {};
        if (cfg.stop_loss) document.getElementById('risk-sl').value = parseFloat(cfg.stop_loss);
        if (cfg.take_profit) document.getElementById('risk-tp').value = parseFloat(cfg.take_profit);
        if (cfg.max_risk_per_trade) document.getElementById('risk-per-trade').value = parseFloat(cfg.max_risk_per_trade);
        if (cfg.trailing_stop) document.getElementById('risk-trailing').value = parseFloat(cfg.trailing_stop);
        if (cfg.max_open_positions) document.getElementById('risk-max-pos').value = cfg.max_open_positions;
        if (cfg.max_daily_trades) document.getElementById('risk-max-daily').value = cfg.max_daily_trades;
        if (cfg.max_daily_loss) document.getElementById('risk-max-loss').value = parseFloat(cfg.max_daily_loss);

        // Positions
        const posEl = document.getElementById('risk-positions');
        const positions = data.positions || [];
        if (positions.length === 0) {
            posEl.innerHTML = '<p class="empty-state">Nenhuma posicao aberta</p>';
        } else {
            posEl.innerHTML = positions.map(p => `
                <div class="risk-position-card ${p.side.toLowerCase()}">
                    <div class="pos-field"><span class="pos-field-label">Par</span><span class="pos-field-value">${p.symbol}</span></div>
                    <div class="pos-field"><span class="pos-field-label">Lado</span><span class="pos-field-value side-${p.side.toLowerCase()}">${p.side}</span></div>
                    <div class="pos-field"><span class="pos-field-label">Entrada</span><span class="pos-field-value">$${p.entry_price}</span></div>
                    <div class="pos-field"><span class="pos-field-label">Quantidade</span><span class="pos-field-value">${p.quantity}</span></div>
                    <div class="pos-field"><span class="pos-field-label">Stop Loss</span><span class="pos-field-value" style="color:#f85149">$${p.stop_loss}</span></div>
                    <div class="pos-field"><span class="pos-field-label">Take Profit</span><span class="pos-field-value" style="color:#3fb950">$${p.take_profit}</span></div>
                    <div class="pos-field"><span class="pos-field-label">Trailing</span><span class="pos-field-value">$${p.trailing_stop}</span></div>
                    <div class="pos-field"><span class="pos-field-label">Aberto em</span><span class="pos-field-value">${new Date(p.opened_at).toLocaleString('pt-BR')}</span></div>
                </div>
            `).join('');
        }

        // Closed today
        const closedEl = document.getElementById('risk-closed-today');
        const closed = data.closed_today || [];
        if (closed.length === 0) {
            closedEl.innerHTML = '<p class="empty-state">Nenhum fechamento hoje</p>';
        } else {
            closedEl.innerHTML = closed.map(c => `
                <div class="risk-position-card ${c.pnl >= 0 ? 'buy' : 'sell'}">
                    <div class="pos-field"><span class="pos-field-label">Par</span><span class="pos-field-value">${c.symbol}</span></div>
                    <div class="pos-field"><span class="pos-field-label">P&L</span><span class="pos-field-value" style="color:${c.pnl >= 0 ? '#3fb950' : '#f85149'}">${c.pnl >= 0 ? '+' : ''}$${c.pnl}</span></div>
                    <div class="pos-field"><span class="pos-field-label">Motivo</span><span class="pos-field-value">${c.reason}</span></div>
                </div>
            `).join('');
        }

    } catch (err) {
        console.error('Risk status error:', err);
    }
}

async function saveRiskConfig() {
    const btn = document.getElementById('btn-save-risk');
    btn.innerHTML = '<span class="loading"></span>';
    btn.disabled = true;

    try {
        const params = new URLSearchParams({
            stop_loss: document.getElementById('risk-sl').value / 100,
            take_profit: document.getElementById('risk-tp').value / 100,
            risk_per_trade: document.getElementById('risk-per-trade').value / 100,
            trailing_stop: document.getElementById('risk-trailing').value / 100,
            max_positions: document.getElementById('risk-max-pos').value,
            max_daily_trades: document.getElementById('risk-max-daily').value,
            max_daily_loss: document.getElementById('risk-max-loss').value / 100
        });

        await api(`/trading/risk/config/?${params}`, { method: 'POST' });
        showToast('Configuracao de risco salva!', 'success');

    } catch (err) {
        showToast('Erro: ' + err.message, 'error');
    } finally {
        btn.textContent = 'SALVAR CONFIGURACAO';
        btn.disabled = false;
    }
}

// === Helpers ===

function showTradeResult(type, html) {
    const el = document.getElementById('trade-result');
    el.className = `trade-result ${type}`;
    el.innerHTML = html;
    el.classList.remove('hidden');
}

function disableTradeButtons(disabled) {
    ['btn-buy', 'btn-sell', 'btn-auto'].forEach(id => {
        document.getElementById(id).disabled = disabled;
    });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
