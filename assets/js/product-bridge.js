(() => {
  const CART_KEY = 'chefpro_cart_v1';
  const product = { id: 'chefpro-2l', title: 'Triturador Elétrico ChefPro 2L Bivolt + Tábua de Madeira Grátis', price: 137.90, image: 'https://lojamaxlarapp.com/cdn/shop/files/6_700x_e3bfb5c3-31ad-4db8-8622-d66c1ed366f3.webp?v=1789224097' };
  const saveCart = quantity => localStorage.setItem(CART_KEY, JSON.stringify({ ...product, quantity: Math.min(10, Math.max(1, Number(quantity) || 1)) }));
  const goToCart = quantity => { saveCart(quantity); window.location.assign('carrinho.html'); };
  document.addEventListener('submit', event => { const form = event.target.closest('form.shopify-product-form'); if (!form) return; event.preventDefault(); event.stopImmediatePropagation(); goToCart(form.querySelector('[name="quantity"]')?.value); }, true);
  document.addEventListener('click', event => { const cart = event.target.closest('[aria-label^="Abrir carrinho"], cart-icon, a[href="/cart"]'); if (!cart) return; event.preventDefault(); event.stopImmediatePropagation(); const quantity = document.querySelector('form.shopify-product-form [name="quantity"]')?.value || 1; goToCart(quantity); }, true);
})();
