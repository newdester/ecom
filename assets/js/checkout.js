(() => {
  const cart = Storefront.getCart();
  if (!cart) { location.replace('carrinho.html'); return; }
  const $ = s => document.querySelector(s), total = cart.price * cart.quantity;
  $('#checkoutItem').innerHTML = `<div class="cart-line"><img src="${cart.image}" alt="${cart.title}"><div><p class="cart-name">${cart.title}</p><span class="cart-meta">Quantidade: ${cart.quantity}</span></div><b class="cart-price">${Storefront.brl(total)}</b></div>`;
  $('#checkoutTotal').textContent = Storefront.brl(total);
  const status = message => { const target = $('#paymentStatus'); target.textContent = message; target.classList.add('show'); };
  const mask = (id, formatter) => $(id).addEventListener('input', event => event.target.value = formatter(event.target.value));
  mask('#cpf', value => value.replace(/\D/g,'').slice(0,11).replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'));
  mask('#zip', value => value.replace(/\D/g,'').slice(0,8).replace(/(\d{5})(\d)/,'$1-$2'));
  let controller;
  async function renderBrick(customer) {
    const config = await fetch('/api/config').then(response => response.json());
    if (!config.paymentEnabled || !config.publicKey || !window.MercadoPago) { status('Pagamento ainda não configurado. Adicione MP_PUBLIC_KEY e MP_ACCESS_TOKEN ao arquivo .env para ativar o ambiente de testes.'); return; }
    const mp = new MercadoPago(config.publicKey, { locale: 'pt-BR' });
    const settings = { initialization: { amount: Number(total.toFixed(2)), payer: { email: customer.email, identification: { type: 'CPF', number: customer.cpf.replace(/\D/g,'') } } }, customization: { paymentMethods: { creditCard: 'all', debitCard: 'all', bankTransfer: 'all', ticket: 'all', mercadoPago: 'all' } }, callbacks: {
      onReady: () => {}, onError: error => { console.error(error); status('Não foi possível carregar um método de pagamento. Confira as credenciais e tente novamente.'); },
      onSubmit: ({ formData }) => new Promise((resolve, reject) => fetch('/api/process_payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formData, quantity: cart.quantity, customer }) }).then(response => response.json().then(data => ({ ok: response.ok, data }))).then(({ ok, data }) => { if (!ok) { status(data.cause || data.error || 'Pagamento não aprovado.'); reject(); return; } sessionStorage.setItem(Storefront.PAYMENT, JSON.stringify(data)); resolve(); location.assign('obrigado.html'); }).catch(() => { status('Falha de conexão. Tente novamente.'); reject(); }))
    }};
    controller = await mp.bricks().create('payment', 'paymentBrick_container', settings);
  }
  $('#customerForm').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; if (!form.checkValidity()) { form.reportValidity(); return; } const customer = Object.fromEntries(new FormData(form).entries()); customer.name = $('#name').value.trim(); customer.email = $('#email').value.trim(); customer.phone = $('#phone').value.trim(); customer.cpf = $('#cpf').value.trim(); customer.zip = $('#zip').value.trim(); customer.address = $('#address').value.trim(); customer.number = $('#number').value.trim(); customer.complement = $('#complement').value.trim(); customer.district = $('#district').value.trim(); customer.city = $('#city').value.trim(); localStorage.setItem(Storefront.CUSTOMER, JSON.stringify(customer)); form.classList.add('hidden'); $('#paymentArea').classList.remove('hidden'); $('#paymentArea').scrollIntoView({ behavior: 'smooth', block: 'start' }); await renderBrick(customer); });
  try { const customer = JSON.parse(localStorage.getItem(Storefront.CUSTOMER) || '{}'); Object.entries(customer).forEach(([key, value]) => { const field = document.querySelector(`#${key}`); if (field) field.value = value; }); } catch {}
  window.addEventListener('pagehide', () => controller?.unmount?.());
})();
