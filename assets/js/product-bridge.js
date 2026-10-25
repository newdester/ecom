(() => {
  const CART_KEY = 'chefpro_cart_v1';
  const product = { id: 'chefpro-2l', title: 'Triturador Elétrico ChefPro 2L Bivolt + Tábua de Madeira Grátis', price: 89.90, image: 'https://lojamaxlarapp.com/cdn/shop/files/6_700x_e3bfb5c3-31ad-4db8-8622-d66c1ed366f3.webp?v=1789224097' };
  const loadPixel = callback => {
    if (window.MetaPixel) return callback();
    window.addEventListener('meta-pixel-ready', callback, { once: true });
    if (!document.querySelector('script[src="assets/js/meta-pixel.js"]')) { const script = document.createElement('script'); script.src = 'assets/js/meta-pixel.js'; document.head.append(script); }
  };
  loadPixel(() => window.MetaPixel.track('ViewContent', window.MetaPixel.content(product)));
  document.addEventListener('DOMContentLoaded', () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: node => /^(SCRIPT|STYLE)$/i.test(node.parentElement?.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    for (let node; node = walker.nextNode();) node.nodeValue = node.nodeValue.replaceAll('R$ 137,90', 'R$ 89,90').replaceAll('R$ 13,77', 'R$ 8,90');
  });
  const saveCart = quantity => localStorage.setItem(CART_KEY, JSON.stringify({ ...product, quantity: Math.min(10, Math.max(1, Number(quantity) || 1)) }));
  const goToCart = quantity => { const units = Math.min(10, Math.max(1, Number(quantity) || 1)); saveCart(units); loadPixel(() => window.MetaPixel.track('AddToCart', { ...window.MetaPixel.content(product), contents: [{ id: product.id, quantity: units }] })); window.location.assign('carrinho.html'); };
  document.addEventListener('submit', event => { const form = event.target.closest('form.shopify-product-form'); if (!form) return; event.preventDefault(); event.stopImmediatePropagation(); goToCart(form.querySelector('[name="quantity"]')?.value); }, true);
  document.addEventListener('click', event => { const cart = event.target.closest('[aria-label^="Abrir carrinho"], cart-icon, a[href="/cart"]'); if (!cart) return; event.preventDefault(); event.stopImmediatePropagation(); const quantity = document.querySelector('form.shopify-product-form [name="quantity"]')?.value || 1; goToCart(quantity); }, true);
})();
