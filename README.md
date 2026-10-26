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

- No Vercel, importe o repositório `newdester/ecom`, selecione a branch `main` e mantenha o diretório raiz como `./`.
- Em **Settings → Environment Variables**, cadastre `MP_PUBLIC_KEY` e `MP_ACCESS_TOKEN`; não as coloque em arquivos do projeto.
- Use uma URL pública com HTTPS em `PUBLIC_BASE_URL`.
- Configure uma notificação (webhook) do Mercado Pago apontando para `/api/mercadopago/webhook` e implemente a validação de assinatura no ambiente de hospedagem.
- Troque as chaves de teste pelas chaves de produção somente depois de concluir uma compra de teste aprovada.
- Publique este servidor Node; hospedar somente os arquivos HTML não processará pagamentos.

## Painel de operações

O painel fica em `/admin`, sem login ou chave de acesso. Ele consulta o Mercado Pago no servidor, resume vendas do ChefPro, pagamentos pendentes, meios de pagamento, parcelas, comparativo entre dois períodos e recomendações operacionais. Ele não mostra dados pessoais, cartões ou segredos.

Para incorporar desempenho de anúncios por campanha, configure também `META_AD_ACCOUNT_ID`, `META_ADS_ACCESS_TOKEN` (com permissões `ads_read` e `read_insights`) e `META_GRAPH_API_VERSION`. O token da Conversions API não deve ser reutilizado para esse fim.

Limites atuais: a API do Mercado Pago fornece até doze meses de pagamentos, e o painel filtra as transações por `CP-`/ChefPro. Os eventos de navegação já são enviados ao Pixel, mas ainda não são persistidos em um banco próprio; por isso a contagem completa de visualização → carrinho → checkout aparece como pendência de integração de analytics.

## Verificações realizadas

- Sintaxe do servidor e dos scripts JavaScript.
- Resposta HTTP das quatro páginas e da rota de configuração.
- Proteção do endpoint de pagamento sem credenciais: retorna `503`, sem criar cobrança.
