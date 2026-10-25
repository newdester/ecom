import { randomUUID } from 'node:crypto';

const product = {
  id: 'chefpro-2l',
  title: 'Triturador Elétrico ChefPro 2L Bivolt + Tábua de Madeira Grátis',
  unitPrice: 137.9
};

const quantityFrom = value => Math.min(10, Math.max(1, Number.parseInt(value, 10) || 1));
const baseUrl = () => String(process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método não permitido.' });
  if (!process.env.MP_ACCESS_TOKEN || !process.env.MP_PUBLIC_KEY) return response.status(503).json({ error: 'Pagamento ainda não configurado.' });

  const { formData = {}, quantity: requestedQuantity, customer = {} } = request.body || {};
  const quantity = quantityFrom(requestedQuantity);
  if (!formData.payment_method_id || !formData.payer?.email) return response.status(422).json({ error: 'Dados de pagamento incompletos.' });

  const orderId = `CP-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const payload = {
    transaction_amount: Number((product.unitPrice * quantity).toFixed(2)),
    token: formData.token,
    description: `${product.title} × ${quantity}`,
    installments: Number(formData.installments) || 1,
    payment_method_id: formData.payment_method_id,
    issuer_id: formData.issuer_id,
    payer: formData.payer,
    external_reference: orderId,
    metadata: { product_id: product.id, quantity, customer_name: String(customer.name || '').slice(0, 120) }
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
    return response.status(200).json({
      orderId,
      paymentId: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,
      amount: payload.transaction_amount,
      pix: payment.point_of_interaction?.transaction_data || null
    });
  } catch {
    return response.status(502).json({ error: 'Não foi possível comunicar com o provedor de pagamento.' });
  }
}
