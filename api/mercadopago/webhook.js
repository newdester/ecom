export default function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).end();
  // A validação da assinatura deve ser ativada antes de produção, com o segredo
  // configurado nas variáveis de ambiente do projeto Vercel.
  return response.status(200).send('ok');
}
