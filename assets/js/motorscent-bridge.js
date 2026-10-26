(() => {
  const priceFor = quantity => quantity === 1 ? 139.90 : quantity === 2 ? 129.90 : 99.90;
  const brl = value => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const translations = new Map([
    ['Your car. Your scent. Your space.', 'Seu carro. Seu aroma. Seu espaço.'],
    ['Motor Scent is a desk humidifier shaped like your dream ride.', 'Motor Scent é um umidificador de mesa no formato do carro dos seus sonhos.'],
    ['Choose your ride', 'Escolha seu carro'], ['Add to cart', 'Adicionar ao carrinho'], ['Buy it now', 'Comprar agora'],
    ['Quantity', 'Quantidade'], ['Free shipping', 'Frete grátis'], ['Shipping', 'Envio'], ['Cart', 'Carrinho'],
    ['Checkout', 'Finalizar compra'], ['Sold out', 'Esgotado'], ['In stock', 'Em estoque'], ['Save', 'Economize'],
    ['Order now', 'Compre agora'], ['Secure checkout', 'Pagamento seguro'], ['Shipping protection', 'Proteção de envio'],
    ['Lavender Oil for Motor Scent', 'Óleo de lavanda para Motor Scent'], ['Frequently bought together', 'Comprados juntos com frequência'],
    ['Realistic lights, exhaust mist and a quiet motor turn any room into a garage at night.', 'Luzes realistas, névoa pelo escapamento e um motor silencioso transformam qualquer ambiente em uma garagem à noite.'],
    ['Black 911 GT3 RS', '911 GT3 RS preto'], ['Red Bull F1', 'Fórmula 1 Red Bull'], ['Green M4', 'M4 verde'],
    ['Orange Raptor', 'Raptor laranja'], ['Blue Raptor', 'Raptor azul'], ['Red Raptor', 'Raptor vermelho'],
    ['Green Aventador SVJ', 'Aventador SVJ verde'], ['Orange Aventador SVJ', 'Aventador SVJ laranja'],
    ['Green McLaren Senna', 'McLaren Senna verde'], ['Black C63 AMG', 'C63 AMG preto'], ['Black G-Wagon', 'G-Wagon preto'],
    ['Black Corvette Z06', 'Corvette Z06 preto'], ['Purple Hellcat', 'Hellcat roxo'], ['Black RS6 Avant', 'RS6 Avant preto'],
    ['Black Ram TRX', 'Ram TRX preta'], ['Grey Shelby GT500', 'Shelby GT500 cinza'], ['Grey Audi R8', 'Audi R8 cinza']
  ]);
  const translate = root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: node => /^(SCRIPT|STYLE)$/i.test(node.parentElement?.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    for (let node; node = walker.nextNode();) { let value = node.nodeValue; translations.forEach((to, from) => { value = value.replaceAll(from, to); }); node.nodeValue = value; }
  };
  const selectedVariant = () => document.querySelector('input[name="id"]:checked, select[name="id"] option:checked')?.textContent?.trim() || document.querySelector('[name="id"]')?.value || 'Motor Scent';
  const selectedImage = () => document.querySelector('[data-media-id] img, .product__media img, .product-media img')?.getAttribute('src') || 'motorscent-assets/images/motor-scent-gt3.png';
  const updateOffer = () => {
    const quantity = Math.max(1, Number(document.querySelector('[name="quantity"]')?.value || 1));
    const unit = priceFor(quantity), total = unit * quantity;
    document.querySelectorAll('.price, .product__price, [data-price]').forEach(element => { if (element.children.length === 0) element.textContent = brl(total); });
    let note = document.querySelector('#motorscent-local-offer');
    if (!note) { note = document.createElement('p'); note.id = 'motorscent-local-offer'; note.style.cssText = 'font-weight:700;margin:12px 0;color:#111'; const anchor = document.querySelector('form[action*="cart/add"], form.shopify-product-form'); anchor?.prepend(note); }
    if (note) note.textContent = quantity === 1 ? '1 unidade por R$ 139,90' : quantity === 2 ? '2 unidades por R$ 129,90 cada' : `${quantity} unidades por R$ 99,90 cada`;
  };
  const goToCheckout = event => {
    const form = event.target instanceof Element ? event.target.closest('form[action*="cart/add"], form.shopify-product-form') : null;
    if (!form) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const quantity = Math.min(10, Math.max(1, Number(form.querySelector('[name="quantity"]')?.value || 1)));
    const unit = priceFor(quantity);
    localStorage.setItem('chefpro_cart_v1', JSON.stringify({ id: 'motor-scent', title: `Motor Scent — ${selectedVariant()}`, image: selectedImage(), quantity, price: unit }));
    location.assign('/carrinho');
  };
  document.addEventListener('DOMContentLoaded', () => { document.documentElement.lang = 'pt-BR'; translate(document.body); updateOffer(); document.querySelectorAll('[name="quantity"]').forEach(input => input.addEventListener('change', updateOffer)); }, { once: true });
  document.addEventListener('submit', goToCheckout, true);
  document.addEventListener('click', event => { const link = event.target instanceof Element && event.target.closest('a[href*="/cart"], a[href*="/checkout"]'); if (!link) return; event.preventDefault(); const form = document.querySelector('form[action*="cart/add"], form.shopify-product-form'); if (form) goToCheckout({ target: form, preventDefault() {}, stopImmediatePropagation() {} }); }, true);
})();
