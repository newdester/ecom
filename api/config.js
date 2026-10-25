const product = {
  id: 'chefpro-2l',
  title: 'Triturador Elétrico ChefPro 2L Bivolt + Tábua de Madeira Grátis',
  unitPrice: 89.9,
  currency: 'BRL'
};

export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({
    publicKey: process.env.MP_PUBLIC_KEY || '',
    paymentEnabled: Boolean(process.env.MP_PUBLIC_KEY && process.env.MP_ACCESS_TOKEN),
    product
  });
}
