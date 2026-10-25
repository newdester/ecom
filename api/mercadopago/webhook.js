import { createHmac, timingSafeEqual } from 'node:crypto';
import { rateLimit, sendRateHeaders } from '../_lib/rate-limit.js';

const header = (request, name) => String(request.headers[name] || '');

function signatureIsValid(request) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  // Sem segredo, o endpoint só reconhece a chamada, mas não aceita atualizar pedidos.
  if (!secret) return false;
  const signature = header(request, 'x-signature');
  const requestId = header(request, 'x-request-id');
  const dataId = String(request.query?.['data.id'] || request.body?.data?.id || '').toLowerCase();
  const values = Object.fromEntries(signature.split(',').map(value => value.trim().split('=')));
  if (!values.ts || !values.v1 || !requestId || !dataId) return false;
  const manifest = `id:${dataId};request-id:${requestId};ts:${values.ts};`;
  const expected = createHmac('sha256', secret).update(manifest).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(values.v1, 'utf8'));
  } catch {
    return false;
  }
}

export default function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).end();
  const quota = rateLimit(request, 'webhook', { limit: 120, windowMs: 60_000 });
  sendRateHeaders(response, quota);
  if (!quota.allowed) return response.status(429).json({ error: 'Limite de notificações excedido.' });
  if (!signatureIsValid(request)) return response.status(401).json({ error: 'Assinatura de webhook inválida.' });
  // Confirme o pagamento consultando a API por data.id antes de alterar pedido/estoque.
  return response.status(200).json({ received: true });
}
