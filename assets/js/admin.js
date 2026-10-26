(() => {
  const $ = selector => document.querySelector(selector);
  const tokenKey = 'maxlar_admin_dashboard_token';
  const date = value => new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  const time = value => new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const percent = value => value === null || value === undefined ? 'sem base' : `${value > 0 ? '+' : ''}${Number(value).toLocaleString('pt-BR')}%`;
  const escape = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  const iso = value => value.toISOString().slice(0, 10);
  const defaultPeriods = () => { const end = new Date(); end.setHours(0, 0, 0, 0); const start = new Date(end); start.setDate(start.getDate() - 29); const previousEnd = new Date(start); previousEnd.setDate(previousEnd.getDate() - 1); const previousStart = new Date(previousEnd); previousStart.setDate(previousStart.getDate() - 29); return { currentStart: iso(start), currentEnd: iso(end), previousStart: iso(previousStart), previousEnd: iso(previousEnd) }; };
  const state = { token: '', data: null };

  function tokenFromLocation() {
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const token = hash.get('token');
    if (token) { sessionStorage.setItem(tokenKey, token); history.replaceState(null, '', `${location.pathname}${location.search}`); return token; }
    return sessionStorage.getItem(tokenKey) || '';
  }

  function setPeriods(values = defaultPeriods()) { Object.entries(values).forEach(([key, value]) => { $(`#${key}`).value = value; }); }
  function currentPeriods() { return { currentStart: $('#currentStart').value, currentEnd: $('#currentEnd').value, previousStart: $('#previousStart').value, previousEnd: $('#previousEnd').value }; }
  function metric(label, value, compare, hint) { const direction = compare === null || compare === undefined ? '' : compare >= 0 ? 'delta-up' : 'delta-down'; return `<article class="metric"><p class="eyebrow">${label}</p><strong>${value}</strong><small class="${direction}">${compare === null || compare === undefined ? hint : `${percent(compare)} vs. período anterior`}</small></article>`; }

  function renderMetrics(data) {
    const { totals } = data.current;
    $('#metrics').innerHTML = [
      metric('Faturamento aprovado', money(totals.revenue), data.comparison.revenue, 'Sem comparação suficiente'),
      metric('Pedidos aprovados', totals.approved, data.comparison.approved, 'Sem comparação suficiente'),
      metric('Aprovação entre tentativas', totals.approvalRate === null ? '—' : `${totals.approvalRate}%`, null, `${totals.attempts} tentativa(s)`),
      metric('Pix pendente', money(totals.pendingValue), null, `${totals.pending} pagamento(s) aguardando`)
    ].join('');
    $('#paymentStatus').textContent = totals.attempts ? `${totals.attempts} tentativa(s)` : 'sem dados';
  }

  function renderChart(daily) {
    const max = Math.max(1, ...daily.map(item => Number(item.revenue || 0)));
    $('#chart').innerHTML = daily.map(item => { const height = item.revenue ? Math.max(4, (item.revenue / max) * 100) : 2; return `<i class="bar" style="height:${height}%" data-label="${date(`${item.date}T00:00:00Z`)} · ${money(item.revenue)}"></i>`; }).join('');
  }

  function renderPayments(data) {
    const max = Math.max(1, ...data.current.methods.map(item => Number(item.revenue || 0)));
    $('#methods').innerHTML = data.current.methods.filter(item => item.orders || item.revenue).map(item => `<div class="method-row"><span>${escape(item.method.replaceAll('_', ' '))}</span><span class="method-track"><i style="width:${(item.revenue / max) * 100}%"></i></span><b>${money(item.revenue)}</b></div>`).join('') || '<p class="muted">Sem pagamentos aprovados no período.</p>';
    $('#installments').innerHTML = data.current.installments.length ? `<strong>Parcelas aprovadas</strong>${data.current.installments.map(item => `<span>${item.installments}x · ${item.orders}</span>`).join('')}` : '';
  }

  function renderCampaigns(data) {
    const campaigns = data.campaigns.current;
    if (!campaigns.connected) { $('#campaigns').innerHTML = `<p class="campaign-empty">${escape(campaigns.reason)} Este painel continuará mostrando as vendas do Mercado Pago normalmente.</p>`; return; }
    const summarize = list => list.reduce((summary, item) => ({ spend: summary.spend + Number(item.spend || 0), clicks: summary.clicks + Number(item.clicks || 0), purchases: summary.purchases + Number(item.purchases || 0) }), { spend: 0, clicks: 0, purchases: 0 });
    const current = summarize(campaigns.campaigns);
    const previous = summarize(data.campaigns.previous.campaigns || []);
    const comparison = `<div class="campaign-summary"><span><b>Atual</b>${money(current.spend)} · ${current.clicks} cliques · ${current.purchases} compras</span><span><b>Anterior</b>${money(previous.spend)} · ${previous.clicks} cliques · ${previous.purchases} compras</span></div>`;
    $('#campaigns').innerHTML = campaigns.campaigns.length ? `${comparison}<div class="table-wrap"><table class="campaign-table"><thead><tr><th>Campanha atual</th><th>Investimento</th><th>Cliques</th><th>CTR</th><th>Compras</th></tr></thead><tbody>${campaigns.campaigns.map(item => `<tr><td title="${escape(item.name)}">${escape(item.name)}</td><td>${money(item.spend)}</td><td>${item.clicks}</td><td>${item.ctr}%</td><td>${item.purchases}</td></tr>`).join('')}</tbody></table></div>` : `${comparison}<p class="campaign-empty">Nenhuma campanha retornada no período atual.</p>`;
  }

  function renderFunnel(data) {
    const events = data.funnel.trackedEvents.map(event => `<li>${escape(event)}</li>`).join('');
    $('#funnel').innerHTML = `<ul class="funnel-events">${events}</ul><p class="funnel-empty">Os eventos estão instrumentados no site e enviados ao Meta. As contagens próprias de visualização, carrinho e checkout ainda precisam de armazenamento de analytics para aparecerem aqui como conversão de funil.</p>`;
  }

  function renderRecommendations(data) { $('#recommendations').innerHTML = data.recommendations.map(item => `<li class="priority-${item.priority}"><b>${escape(item.title)}</b><span>${escape(item.detail)}</span></li>`).join(''); }
  function renderIntegrations(data) { const labels = { mercadoPago: 'Mercado Pago', webhook: 'Webhook assinado', metaCapi: 'Meta CAPI', metaAds: 'Meta Ads Insights', firstPartyFunnelStorage: 'Banco de funil próprio' }; $('#integrations').innerHTML = Object.entries(labels).map(([key, label]) => `<div class="integration"><span>${label}</span><b class="${data.integrations[key] ? 'ok' : 'pending'}">${data.integrations[key] ? 'Conectado' : 'Pendente'}</b></div>`).join(''); }
  function renderOrders(data) { const orders = data.current.recent; $('#orders').innerHTML = orders.length ? orders.map(item => `<tr><td>${time(item.createdAt)}</td><td>${escape(item.id)}</td><td>${escape(item.method.replaceAll('_', ' '))}</td><td>${item.installments}x</td><td><span class="badge badge-${escape(item.status)}">${escape(item.status)}</span></td><td>${money(item.amount)}</td></tr>`).join('') : '<tr><td colspan="6">Nenhuma tentativa de pagamento no período selecionado.</td></tr>'; }

  function render(data) {
    state.data = data;
    $('#accessCard').classList.add('hidden'); $('#dashboard').classList.remove('hidden');
    renderMetrics(data); renderChart(data.current.daily); renderPayments(data); renderCampaigns(data); renderFunnel(data); renderRecommendations(data); renderIntegrations(data); renderOrders(data);
    $('#updated').textContent = `Atualizado em ${time(data.generatedAt)} · Vendas consultadas diretamente no Mercado Pago.`;
    $('#limitations').textContent = data.limitations.join(' ');
  }

  async function load() {
    if (!state.token) return;
    const periods = currentPeriods();
    const params = new URLSearchParams({ current_start: periods.currentStart, current_end: periods.currentEnd, previous_start: periods.previousStart, previous_end: periods.previousEnd });
    $('#refresh').disabled = true; $('#refresh').textContent = 'Atualizando…'; $('#updated').textContent = 'Consultando dados de vendas…';
    try {
      const response = await fetch(`/api/admin/overview?${params}`, { headers: { Authorization: `Bearer ${state.token}` }, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível carregar o painel.');
      render(data);
    } catch (error) {
      $('#accessCard').classList.remove('hidden'); $('#dashboard').classList.add('hidden'); $('#accessError').textContent = error.message === 'Acesso não autorizado.' ? 'Chave inválida ou expirada.' : error.message;
    } finally { $('#refresh').disabled = false; $('#refresh').textContent = 'Atualizar dados'; }
  }

  setPeriods();
  state.token = tokenFromLocation();
  $('#tokenInput').value = state.token;
  $('#openDashboard').addEventListener('click', () => { state.token = $('#tokenInput').value.trim(); if (!state.token) { $('#accessError').textContent = 'Informe a chave privada do painel.'; return; } sessionStorage.setItem(tokenKey, state.token); load(); });
  $('#periodForm').addEventListener('submit', event => { event.preventDefault(); load(); });
  $('#refresh').addEventListener('click', load);
  if (state.token) load();
})();
