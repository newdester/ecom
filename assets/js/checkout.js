(() => {
  const cart = Storefront.getCart();
  if (!cart) { location.replace('carrinho.html'); return; }
  Storefront.applyBrand(cart);
  const $ = selector => document.querySelector(selector);
  const total = Storefront.totalFor(cart);
  if (!sessionStorage.getItem('meta_initiate_checkout')) { Storefront.track('InitiateCheckout', cart, { value: Number(total.toFixed(2)), num_items: cart.quantity }); sessionStorage.setItem('meta_initiate_checkout', '1'); }
  let savedShipping = null;
  try { savedShipping = JSON.parse(localStorage.getItem('motorscent_shipping_v1') || 'null'); } catch {}
  const destination = savedShipping?.city && savedShipping?.state ? ` para ${savedShipping.city} / ${savedShipping.state}` : '';
  const delivery = `Frete grátis${destination} · entrega estimada de 5 a 7 dias úteis`;
  $('#checkoutItem').innerHTML = `<div class="cart-line"><img src="${cart.image}" alt="${cart.title}"><div><p class="cart-name">${cart.title}</p><span class="cart-meta">Quantidade: ${cart.quantity}</span>${Storefront.extrasFor(cart) ? `<p class="cart-meta">Óleo de lavanda · ${Storefront.brl(Storefront.extrasFor(cart))}</p>` : ''}</div><b class="cart-price">${Storefront.brl(total)}</b></div>`;
  $('#checkoutTotal').textContent = Storefront.brl(total);
  document.querySelector('.summary').insertAdjacentHTML('beforeend', `<p class="delivery-promise">${delivery}</p>`);
  const status = message => { const target = $('#paymentStatus'); target.textContent = message; target.classList.add('show'); };
  let paymentPoll;
  let currentPayment;
  const clearPaymentPoll = () => { if (paymentPoll) { clearInterval(paymentPoll); paymentPoll = null; } };
  const retryPayment = message => {
    status(message);
    if (document.querySelector('#retryPayment')) return;
    const button = document.createElement('button');
    button.id = 'retryPayment'; button.type = 'button'; button.className = 'button'; button.textContent = 'Escolher outra forma de pagamento';
    button.addEventListener('click', () => location.reload());
    $('#paymentStatus').after(button);
  };
  const finalizeApproved = payment => {
    clearPaymentPoll();
    sessionStorage.setItem(Storefront.PAYMENT, JSON.stringify({ ...currentPayment, ...payment, status: 'approved' }));
    location.assign('obrigado.html');
  };
  const showPix = payment => {
    if (document.querySelector('#checkoutPix')) return;
    const pix = payment.pix;
    if (!pix?.qr_code) return;
    const area = document.createElement('section');
    area.id = 'checkoutPix'; area.className = 'pix-box';
    const heading = document.createElement('h2'); heading.textContent = 'Conclua o pagamento via Pix';
    const copy = document.createElement('p'); copy.textContent = 'Após o pagamento, a aprovação será confirmada automaticamente nesta tela.';
    const image = document.createElement('img'); image.alt = 'QR Code Pix'; if (pix.qr_code_base64) image.src = `data:image/png;base64,${pix.qr_code_base64}`;
    const code = document.createElement('code'); code.className = 'pix-code'; code.textContent = pix.qr_code;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'button pix-copy'; button.textContent = 'Copiar código Pix'; button.addEventListener('click', async () => { try { await navigator.clipboard.writeText(pix.qr_code); button.textContent = 'Código copiado!'; } catch { button.textContent = 'Copie o código acima'; } });
    area.append(heading, copy, image, code, button); $('#paymentStatus').before(area);
  };
  const pollPayment = payment => {
    clearPaymentPoll();
    paymentPoll = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment-status?paymentId=${encodeURIComponent(payment.paymentId)}`);
        if (!response.ok) return;
        const updated = await response.json();
        currentPayment = { ...currentPayment, ...updated };
        if (updated.status === 'approved') finalizeApproved(updated);
        if (['rejected', 'cancelled', 'refunded', 'charged_back'].includes(updated.status)) { clearPaymentPoll(); retryPayment('O pagamento não foi aprovado. Escolha outra forma de pagamento para tentar novamente.'); }
      } catch {}
    }, 5000);
  };
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
    const settings = { initialization: { amount: Number(total.toFixed(2)), payer: { email: customer.email, identification: { type: 'CPF', number: customer.cpf.replace(/\D/g, '') } } }, customization: { paymentMethods: { creditCard: 'all', bankTransfer: 'pix', mercadoPago: 'wallet_purchase', minInstallments: 1, maxInstallments: 12 } }, callbacks: {
      onReady: () => {}, onError: error => { console.error(error); status('Não foi possível carregar um método de pagamento. Confira as credenciais e tente novamente.'); },
      onSubmit: ({ formData }) => new Promise((resolve, reject) => { Storefront.track('AddPaymentInfo', cart, { value: Number(total.toFixed(2)), num_items: cart.quantity }); fetch('/api/process_payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formData, quantity: cart.quantity, productId: cart.id, extras: cart.extras || {}, customer }) }).then(response => response.json().then(data => ({ ok: response.ok, data }))).then(({ ok, data }) => { if (!ok) { retryPayment(data.cause || data.error || 'Pagamento não aprovado. Escolha outra forma de pagamento.'); reject(); return; } currentPayment = data; if (data.status === 'approved') { resolve(); finalizeApproved(data); return; } if (data.pix?.qr_code) { showPix(data); status('Aguardando a confirmação do Pix. Assim que aprovado, seu pedido será finalizado automaticamente.'); pollPayment(data); resolve(); return; } if (data.status === 'in_process' || data.status === 'pending') { status('Pagamento em análise. Aguarde a confirmação nesta página.'); pollPayment(data); resolve(); return; } retryPayment('O pagamento não foi aprovado. Escolha outra forma de pagamento para tentar novamente.'); reject(); }).catch(() => { retryPayment('Falha de conexão. Escolha outra forma de pagamento ou tente novamente.'); reject(); }); })
    }};
    controller = await mp.bricks().create('payment', 'paymentBrick_container', settings);
  }
  $('#customerForm').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; if (!form.checkValidity()) { form.reportValidity(); return; } const customer = Object.fromEntries(new FormData(form).entries()); ['name', 'email', 'phone', 'cpf', 'zip', 'address', 'number', 'complement', 'district', 'city'].forEach(key => customer[key] = $(`#${key}`).value.trim()); localStorage.setItem(Storefront.CUSTOMER, JSON.stringify(customer)); form.classList.add('hidden'); $('#paymentArea').classList.remove('hidden'); $('#paymentArea').scrollIntoView({ behavior: 'smooth', block: 'start' }); await renderBrick(customer); });
  try { const customer = JSON.parse(localStorage.getItem(Storefront.CUSTOMER) || '{}'); Object.entries(customer).forEach(([key, value]) => { const field = document.querySelector(`#${key}`); if (field) field.value = value; }); } catch {}
  if (!$('#zip').value && savedShipping?.zip) { $('#zip').value = savedShipping.zip; fillAddressFromZip(); }
  window.addEventListener('pagehide', () => { clearPaymentPoll(); controller?.unmount?.(); });
})();
