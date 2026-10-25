# E-commerce ChefPro

## Fluxo implementado

`index.html` → `carrinho.html` → `checkout.html` → `obrigado.html`

Os botões de adicionar ao carrinho e o ícone de carrinho da página original são interceptados por `assets/js/product-bridge.js`. O produto e a quantidade ficam no navegador até a finalização.

## Mercado Pago — ambiente de teste

1. Copie `.env.example` para `.env`.
2. Preencha `MP_PUBLIC_KEY` e `MP_ACCESS_TOKEN` com as credenciais de **teste** da sua aplicação Mercado Pago.
3. Execute `npm start` nesta pasta.
4. Abra `http://localhost:4173`.

O checkout usa o **Payment Brick** do Mercado Pago para cartão e Pix. Os campos de cartão são hospedados/tokenizados pelo Mercado Pago: este projeto não grava número de cartão, CVV ou senha.

## Antes de produção

- Use uma URL pública com HTTPS em `PUBLIC_BASE_URL`.
- Configure uma notificação (webhook) do Mercado Pago apontando para `/api/mercadopago/webhook` e implemente a validação de assinatura no ambiente de hospedagem.
- Troque as chaves de teste pelas chaves de produção somente depois de concluir uma compra de teste aprovada.
- Publique este servidor Node; hospedar somente os arquivos HTML não processará pagamentos.

## Verificações realizadas

- Sintaxe do servidor e dos scripts JavaScript.
- Resposta HTTP das quatro páginas e da rota de configuração.
- Proteção do endpoint de pagamento sem credenciais: retorna `503`, sem criar cobrança.
