import { randomUUID } from 'node:crypto';
import { rateLimit, sendRateHeaders } from './_lib/rate-limit.js';
import { sendMetaPurchase } from './_lib/meta-capi.js';

const products = {
  'chefpro-2l': { id: 'chefpro-2l', title: 'Triturador Elétrico ChefPro 2L Bivolt + Tábua de Madeira Grátis', unitPrice: 89.9 },
  'motor-scent': { id: 'motor-scent', title: 'Motor Scent — Umidificador Automotivo', unitPrice: 139.9 }
};

const quantityFrom = value => Math.min(10, Math.max(1, Number.parseInt(value, 10) || 1));
const priceFor = (product, quantity) => product.id === 'motor-scent' ? (quantity === 1 ? 139.9 : quantity === 2 ? 129.9 : 99.9) : product.unitPrice;
const baseUrl = () => String(process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método não permitido.' });
  const quota = rateLimit(request, 'payment', { limit: 5, windowMs: 60_000 });
  sendRateHeaders(response, quota);
  if (!quota.allowed) return response.status(429).json({ error: 'Muitas tentativas. Aguarde um minuto antes de tentar novamente.' });
  if (!process.env.MP_ACCESS_TOKEN || !process.env.MP_PUBLIC_KEY) return response.status(503).json({ error: 'Pagamento ainda não configurado.' });

  const { formData = {}, quantity: requestedQuantity, customer = {}, productId, extras = {} } = request.body || {};
  const quantity = quantityFrom(requestedQuantity);
  const product = products[String(productId || 'chefpro-2l')] || products['chefpro-2l'];
  const email = String(formData.payer?.email || '').trim();
  if (!formData.payment_method_id || !/^\S+@\S+\.\S+$/.test(email)) return response.status(422).json({ error: 'Dados de pagamento incompletos.' });
  const allowedPaymentTypes = new Set(['credit_card', 'bank_transfer', 'account_money']);
  if (formData.payment_type_id && !allowedPaymentTypes.has(formData.payment_type_id)) {
    return response.status(422).json({ error: 'Este meio de pagamento não está disponível para esta compra.' });
  }

  const lavenderOil = product.id === 'motor-scent' && extras?.lavenderOil === true;
  const extrasAmount = lavenderOil ? 20 : 0;
  const orderId = `CP-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const payload = {
    transaction_amount: Number((priceFor(product, quantity) * quantity + extrasAmount).toFixed(2)),
    token: formData.token,
    description: `${product.title} × ${quantity}${lavenderOil ? ' + óleo de lavanda' : ''}`,
    installments: Number(formData.installments) || 1,
    payment_method_id: formData.payment_method_id,
    issuer_id: formData.issuer_id,
    payer: { ...formData.payer, email },
    external_reference: orderId,
    metadata: { product_id: product.id, quantity, lavender_oil: lavenderOil, customer_name: String(customer.name || '').slice(0, 120) }
  };
  // Cartão gera token; alguns meios (como Pix) não o utilizam.
  Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
  if (baseUrl()) payload.notification_url = `${baseUrl()}/api/mercadopago/webhook`;

  try {
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': randomUUID()
      },
      body: JSON.stringify(payload)
    });
    const payment = await mpResponse.json();
    if (!mpResponse.ok) return response.status(422).json({ error: payment.message || 'O pagamento não foi autorizado.', cause: payment.cause?.[0]?.description || null });
    const meta = await sendMetaPurchase(payment);
    return response.status(200).json({
      orderId,
      paymentId: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,
      amount: payload.transaction_amount,
      pix: payment.point_of_interaction?.transaction_data || null,
      metaEventId: meta.eventId || `mp_payment_${payment.id}`
    });
  } catch {
    return response.status(502).json({ error: 'Não foi possível comunicar com o provedor de pagamento.' });
  }
}
