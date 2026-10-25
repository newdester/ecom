import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries((await readFile(path.join(root, '.env'), 'utf8').catch(() => '')).split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#')).map(line => { const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1)]; }));
const config = { publicKey: env.MP_PUBLIC_KEY || '', accessToken: env.MP_ACCESS_TOKEN || '', publicBaseUrl: String(env.PUBLIC_BASE_URL || '').replace(/\/$/, '') };
const product = { id: 'chefpro-2l', title: 'Triturador Elétrico ChefPro 2L Bivolt + Tábua de Madeira Grátis', unitPrice: 137.90, currency: 'BRL' };
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const reply = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
const readBody = req => new Promise((resolve, reject) => { let data = ''; req.on('data', chunk => { data += chunk; if (data.length > 300000) req.destroy(); }); req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { reject(new Error('JSON inválido')); } }); req.on('error', reject); });
const safeQuantity = value => Math.min(10, Math.max(1, Number.parseInt(value, 10) || 1));

async function processPayment(req, res) {
  if (!config.accessToken || !config.publicKey) return reply(res, 503, { error: 'Integração Mercado Pago não configurada. Adicione as credenciais de teste no arquivo .env.' });
  try {
    const body = await readBody(req);
    const quantity = safeQuantity(body.quantity);
    const form = body.formData || {};
    if (!form.payment_method_id || !form.payer?.email) return reply(res, 422, { error: 'Dados de pagamento incompletos.' });
    const orderId = `CP-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const payload = {
      transaction_amount: Number((product.unitPrice * quantity).toFixed(2)),
      token: form.token,
      description: `${product.title} × ${quantity}`,
      installments: Number(form.installments) || 1,
      payment_method_id: form.payment_method_id,
      issuer_id: form.issuer_id,
      payer: form.payer,
      external_reference: orderId,
      metadata: { product_id: product.id, quantity, customer_name: String(body.customer?.name || '').slice(0, 120) }
    };
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    if (config.publicBaseUrl) payload.notification_url = `${config.publicBaseUrl}/api/mercadopago/webhook`;
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', { method: 'POST', headers: { Authorization: `Bearer ${config.accessToken}`, 'Content-Type': 'application/json', 'X-Idempotency-Key': randomUUID() }, body: JSON.stringify(payload) });
    const payment = await mpResponse.json();
    if (!mpResponse.ok) return reply(res, 422, { error: payment.message || 'O pagamento não foi autorizado.', cause: payment.cause?.[0]?.description || null });
    return reply(res, 200, { orderId, paymentId: payment.id, status: payment.status, statusDetail: payment.status_detail, amount: payload.transaction_amount, pix: payment.point_of_interaction?.transaction_data || null });
  } catch (error) { return reply(res, 500, { error: 'Não foi possível processar o pagamento.', detail: error.message }); }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/api/config') return reply(res, 200, { publicKey: config.publicKey, paymentEnabled: Boolean(config.accessToken && config.publicKey), product });
  if (req.method === 'POST' && url.pathname === '/api/process_payment') return processPayment(req, res);
  if (req.method === 'POST' && url.pathname === '/api/mercadopago/webhook') { res.writeHead(200).end('ok'); return; }
  if (req.method !== 'GET' && req.method !== 'HEAD') return reply(res, 405, { error: 'Método não permitido.' });
  const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root)) return reply(res, 403, { error: 'Acesso negado.' });
  try { const info = await stat(file); if (!info.isFile()) throw new Error('not file'); const data = await readFile(file); res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); if (req.method === 'HEAD') res.end(); else res.end(data); } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Página não encontrada.'); }
}).listen(process.env.PORT || 4173, () => console.log(`Loja em http://localhost:${process.env.PORT || 4173}`));
