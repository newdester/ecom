(() => {
  const cart = Storefront.getCart();
  if (!cart) { location.replace('carrinho.html'); return; }
  const $ = selector => document.querySelector(selector);
  const total = cart.price * cart.quantity;
  if (!sessionStorage.getItem('meta_initiate_checkout')) { Storefront.track('InitiateCheckout', cart, { value: Number(total.toFixed(2)), num_items: cart.quantity }); sessionStorage.setItem('meta_initiate_checkout', '1'); }
  const delivery = 'Frete grátis · entrega estimada de 5 a 7 dias corridos';
  $('#checkoutItem').innerHTML = `<div class="cart-line"><img src="${cart.image}" alt="${cart.title}"><div><p class="cart-name">${cart.title}</p><span class="cart-meta">Quantidade: ${cart.quantity}</span></div><b class="cart-price">${Storefront.brl(total)}</b></div>`;
  $('#checkoutTotal').textContent = Storefront.brl(total);
  document.querySelector('.summary').insertAdjacentHTML('beforeend', `<p class="delivery-promise">${delivery}</p>`);
  const status = message => { const target = $('#paymentStatus'); target.textContent = message; target.classList.add('show'); };
  const zipFeedback = document.createElement('p');
  zipFeedback.className = 'field-feedback';
  zipFeedback.setAttribute('aria-live', 'polite');
  $('#zip').closest('.field').append(zipFeedback);
  const mask = (id, formatter) => $(id).addEventListener('input', event => { event.target.value = formatter(event.target.value); });
  mask('#cpf', value => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'));
  mask('#zip', value => value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2'));
  async function fillAddressFromZip() {
    const zip = $('#zip').value.replace(/\D/g, '');
    if (zip.length !== 8) return;
    zipFeedback.textContent = 'Buscando endereço…';
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
      const address = await response.json();
      if (!response.ok || address.erro) throw new Error('CEP não encontrado');
      $('#address').value = address.logradouro || '';
      $('#district').value = address.bairro || '';
      $('#city').value = [address.localidade, address.uf].filter(Boolean).join(' / ');
      zipFeedback.textContent = 'Endereço preenchido automaticamente.';
      $('#number').focus();
    } catch {
      zipFeedback.textContent = 'Não encontramos esse CEP. Preencha o endereço manualmente.';
    }
  }
  $('#zip').addEventListener('blur', fillAddressFromZip);
  $('#zip').addEventListener('input', event => { if (event.target.value.replace(/\D/g, '').length === 8) fillAddressFromZip(); });
  let controller;
  async function renderBrick(customer) {
    const config = await fetch('/api/config').then(response => response.json());
    if (!config.paymentEnabled || !config.publicKey || !window.MercadoPago) { status('Pagamento ainda não configurado. Adicione MP_PUBLIC_KEY e MP_ACCESS_TOKEN ao arquivo .env para ativar o ambiente de testes.'); return; }
    const mp = new MercadoPago(config.publicKey, { locale: 'pt-BR' });
    const settings = { initialization: { amount: Number(total.toFixed(2)), payer: { email: customer.email, identification: { type: 'CPF', number: customer.cpf.replace(/\D/g, '') } } }, customization: { paymentMethods: { creditCard: 'all', bankTransfer: 'pix', mercadoPago: 'wallet_purchase', minInstallments: 1, maxInstallments: 6 } }, callbacks: {
      onReady: () => {}, onError: error => { console.error(error); status('Não foi possível carregar um método de pagamento. Confira as credenciais e tente novamente.'); },
      onSubmit: ({ formData }) => new Promise((resolve, reject) => { Storefront.track('AddPaymentInfo', cart, { value: Number(total.toFixed(2)), num_items: cart.quantity }); fetch('/api/process_payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formData, quantity: cart.quantity, customer }) }).then(response => response.json().then(data => ({ ok: response.ok, data }))).then(({ ok, data }) => { if (!ok) { status(data.cause || data.error || 'Pagamento não aprovado.'); reject(); return; } sessionStorage.setItem(Storefront.PAYMENT, JSON.stringify(data)); resolve(); location.assign('obrigado.html'); }).catch(() => { status('Falha de conexão. Tente novamente.'); reject(); }); })
    }};
    controller = await mp.bricks().create('payment', 'paymentBrick_container', settings);
  }
  $('#customerForm').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; if (!form.checkValidity()) { form.reportValidity(); return; } const customer = Object.fromEntries(new FormData(form).entries()); ['name', 'email', 'phone', 'cpf', 'zip', 'address', 'number', 'complement', 'district', 'city'].forEach(key => customer[key] = $(`#${key}`).value.trim()); localStorage.setItem(Storefront.CUSTOMER, JSON.stringify(customer)); form.classList.add('hidden'); $('#paymentArea').classList.remove('hidden'); $('#paymentArea').scrollIntoView({ behavior: 'smooth', block: 'start' }); await renderBrick(customer); });
  try { const customer = JSON.parse(localStorage.getItem(Storefront.CUSTOMER) || '{}'); Object.entries(customer).forEach(([key, value]) => { const field = document.querySelector(`#${key}`); if (field) field.value = value; }); } catch {}
  window.addEventListener('pagehide', () => controller?.unmount?.());
})();
