const responsiveCss = document.createElement('link');
responsiveCss.rel = 'stylesheet';
responsiveCss.href = 'assets/css/responsive.css';
document.head.append(responsiveCss);
if (!window.MetaPixel && !document.querySelector('script[src="assets/js/meta-pixel.js"]')) { const metaPixel = document.createElement('script'); metaPixel.src = 'assets/js/meta-pixel.js'; document.head.append(metaPixel); }

const Storefront = (() => {
  const CART = 'chefpro_cart_v1', CUSTOMER = 'chefpro_customer_v1', PAYMENT = 'chefpro_payment_v1';
  const brl = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const unitPrice = (productId, quantity) => {
    const units = Math.max(1, Number(quantity) || 1);
    if (productId === 'motor-scent') return units === 1 ? 139.90 : units === 2 ? 129.90 : 99.90;
    return 89.90;
  };
  const extrasFor = cart => cart?.id === 'motor-scent' && cart?.extras?.lavenderOil ? 20 : 0;
  const totalFor = cart => Number((unitPrice(cart.id, cart.quantity) * cart.quantity + extrasFor(cart)).toFixed(2));
  const getCart = () => { try { return JSON.parse(localStorage.getItem(CART)); } catch { return null; } };
  const putCart = cart => localStorage.setItem(CART, JSON.stringify(cart));
  const applyBrand = cart => {
    if (!cart || cart.id !== 'motor-scent') return;
    document.title = document.title.replace(/MaxLar|ChefPro/g, 'Motor Scent');
    document.querySelectorAll('.logo img, .footer img').forEach(image => { image.src = 'assets/images/motorscent/logo.png'; image.alt = 'Motor Scent'; });
    document.querySelectorAll('.logo, .header-link, .breadcrumb a[href="index.html"]').forEach(link => { if (link.tagName === 'A') link.href = '/motorscent'; });
    document.querySelectorAll('.footer span').forEach(copy => { copy.textContent = '© 2026 Motor Scent. Todos os direitos reservados.'; });
  };
  const renderCart = () => {
    const cart = getCart(), root = document.querySelector('#cartItem'); applyBrand(cart);
    if (!cart || !root) { document.querySelector('#empty')?.classList.remove('hidden'); document.querySelector('#checkoutLink')?.classList.add('hidden'); document.querySelector('#cartCount')?.replaceChildren('0'); return; }
    document.querySelector('#cartCount')?.replaceChildren(String(cart.quantity));
    const draw = () => { const price = unitPrice(cart.id, cart.quantity), extra = extrasFor(cart), total = totalFor(cart); const tier = cart.id === 'motor-scent' ? (cart.quantity === 1 ? 'Oferta para 1 unidade' : cart.quantity === 2 ? 'Oferta para 2 unidades' : 'Oferta para 3 ou mais unidades') : ''; root.innerHTML = `<div class="cart-line"><img src="${cart.image}" alt="${cart.title}"><div><p class="cart-name">${cart.title}</p><span class="cart-meta">${brl(price)} por unidade${tier ? ` · ${tier}` : ''}</span>${extra ? `<p class="cart-meta">Óleo de lavanda para Motor Scent · ${brl(extra)}</p>` : ''}<div class="quantity"><button data-change="-1" aria-label="Diminuir">−</button><strong>${cart.quantity}</strong><button data-change="1" aria-label="Aumentar">+</button><button class="remove" data-remove>Remover</button></div></div><b class="cart-price">${brl(total)}</b></div>`; document.querySelector('#subtotal').textContent = brl(total); document.querySelector('#total').textContent = brl(total); document.querySelector('#deliveryWindow')?.replaceChildren('Entrega estimada: 5 a 7 dias úteis'); };
    root.addEventListener('click', event => { if (event.target.matches('[data-remove]')) { localStorage.removeItem(CART); location.reload(); } const change = Number(event.target.dataset.change); if (change) { cart.quantity = Math.max(1, Math.min(10, cart.quantity + change)); cart.price = unitPrice(cart.id, cart.quantity); putCart(cart); draw(); } }); draw();
    const deliveryWindow = document.createElement('p');
    deliveryWindow.id = 'deliveryWindow';
    deliveryWindow.className = 'delivery-promise';
    deliveryWindow.textContent = 'Entrega estimada: 5 a 7 dias corridos';
    document.querySelector('#total').closest('.summary-row').before(deliveryWindow);
  };
  const renderThankYou = () => { const payment = JSON.parse(sessionStorage.getItem(PAYMENT) || 'null'); const cart = getCart(); applyBrand(cart); if (!payment) return; document.querySelector('#orderReference').textContent = `Pedido ${payment.orderId} · Pagamento ${payment.paymentId}`; if (payment.status === 'approved') { if (cart && !sessionStorage.getItem(`meta_purchase_${payment.paymentId}`)) { const send = () => window.MetaPixel?.track('Purchase', { ...window.MetaPixel.content(cart), value: Number(payment.amount), num_items: cart.quantity, transaction_id: payment.paymentId }, payment.metaEventId || `mp_payment_${payment.paymentId}`); if (window.MetaPixel) send(); else window.addEventListener('meta-pixel-ready', send, { once: true }); sessionStorage.setItem(`meta_purchase_${payment.paymentId}`, '1'); } document.querySelector('#thanksTitle').textContent = 'Pagamento aprovado!'; document.querySelector('#thanksCopy').textContent = 'Seu pedido foi confirmado. Você receberá as próximas atualizações por e-mail.'; localStorage.removeItem(CART); } else if (payment.pix?.qr_code) { document.querySelector('#thanksTitle').textContent = 'Aguardando pagamento Pix'; document.querySelector('#thanksCopy').textContent = 'Assim que identificarmos o Pix, seu pedido será confirmado.'; const area = document.querySelector('#pixArea'); area.classList.remove('hidden'); document.querySelector('#pixCode').textContent = payment.pix.qr_code; if (payment.pix.qr_code_base64) document.querySelector('#pixQr').src = `data:image/png;base64,${payment.pix.qr_code_base64}`; document.querySelector('#copyPix').onclick = async () => { await navigator.clipboard.writeText(payment.pix.qr_code); document.querySelector('#copyPix').textContent = 'Código copiado!'; }; } else { document.querySelector('#thanksTitle').textContent = 'Pedido em análise'; document.querySelector('#thanksCopy').textContent = 'Recebemos sua solicitação. Você será avisado por e-mail quando o pagamento for atualizado.'; } };
  const track = (event, product, extra = {}) => {
    const send = () => window.MetaPixel?.track(event, { ...window.MetaPixel.content(product), ...extra });
    if (window.MetaPixel) send(); else window.addEventListener('meta-pixel-ready', send, { once: true });
  };
  return { CART, CUSTOMER, PAYMENT, brl, unitPrice, extrasFor, totalFor, getCart, putCart, applyBrand, renderCart, renderThankYou, track };
})();
