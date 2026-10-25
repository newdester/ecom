const responsiveCss = document.createElement('link');
responsiveCss.rel = 'stylesheet';
responsiveCss.href = 'assets/css/responsive.css';
document.head.append(responsiveCss);

const Storefront = (() => {
  const CART = 'chefpro_cart_v1', CUSTOMER = 'chefpro_customer_v1', PAYMENT = 'chefpro_payment_v1';
  const brl = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const getCart = () => { try { return JSON.parse(localStorage.getItem(CART)); } catch { return null; } };
  const putCart = cart => localStorage.setItem(CART, JSON.stringify(cart));
  const renderCart = () => {
    const cart = getCart(), root = document.querySelector('#cartItem');
    if (!cart || !root) { document.querySelector('#empty')?.classList.remove('hidden'); document.querySelector('#checkoutLink')?.classList.add('hidden'); document.querySelector('#cartCount')?.replaceChildren('0'); return; }
    document.querySelector('#cartCount')?.replaceChildren(String(cart.quantity));
    const draw = () => { const total = cart.price * cart.quantity; root.innerHTML = `<div class="cart-line"><img src="${cart.image}" alt="${cart.title}"><div><p class="cart-name">${cart.title}</p><span class="cart-meta">${brl(cart.price)} por unidade</span><div class="quantity"><button data-change="-1" aria-label="Diminuir">−</button><strong>${cart.quantity}</strong><button data-change="1" aria-label="Aumentar">+</button><button class="remove" data-remove>Remover</button></div></div><b class="cart-price">${brl(total)}</b></div>`; document.querySelector('#subtotal').textContent = brl(total); document.querySelector('#total').textContent = brl(total); };
    root.addEventListener('click', event => { if (event.target.matches('[data-remove]')) { localStorage.removeItem(CART); location.reload(); } const change = Number(event.target.dataset.change); if (change) { cart.quantity = Math.max(1, Math.min(10, cart.quantity + change)); putCart(cart); draw(); } }); draw();
  };
  const renderThankYou = () => { const payment = JSON.parse(sessionStorage.getItem(PAYMENT) || 'null'); if (!payment) return; document.querySelector('#orderReference').textContent = `Pedido ${payment.orderId} · Pagamento ${payment.paymentId}`; if (payment.status === 'approved') { document.querySelector('#thanksTitle').textContent = 'Pagamento aprovado!'; document.querySelector('#thanksCopy').textContent = 'Seu pedido foi confirmado. Você receberá as próximas atualizações por e-mail.'; localStorage.removeItem(CART); } else if (payment.pix?.qr_code) { document.querySelector('#thanksTitle').textContent = 'Aguardando pagamento Pix'; document.querySelector('#thanksCopy').textContent = 'Assim que identificarmos o Pix, seu pedido será confirmado.'; const area = document.querySelector('#pixArea'); area.classList.remove('hidden'); document.querySelector('#pixCode').textContent = payment.pix.qr_code; if (payment.pix.qr_code_base64) document.querySelector('#pixQr').src = `data:image/png;base64,${payment.pix.qr_code_base64}`; document.querySelector('#copyPix').onclick = async () => { await navigator.clipboard.writeText(payment.pix.qr_code); document.querySelector('#copyPix').textContent = 'Código copiado!'; }; } else { document.querySelector('#thanksTitle').textContent = 'Pedido em análise'; document.querySelector('#thanksCopy').textContent = 'Recebemos sua solicitação. Você será avisado por e-mail quando o pagamento for atualizado.'; } };
  return { CART, CUSTOMER, PAYMENT, brl, getCart, putCart, renderCart, renderThankYou };
})();
