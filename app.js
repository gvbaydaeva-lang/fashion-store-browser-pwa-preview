(function createBrowserStoreApp(global) {
  const CART_STORAGE_KEY = 'browser-store-demo-cart-v1';
  const { products, categories } = global.BrowserStoreData;
  const Core = global.BrowserStoreCore;
  const UI = global.BrowserStoreUI;
  const platform = global.BrowserStorePlatform.createPlatform(global);
  const screen = global.document.querySelector('#screen');
  const bottomNav = global.document.querySelector('#bottom-nav');
  const cartBadge = global.document.querySelector('#cart-badge');
  const toast = global.document.querySelector('#toast');
  const state = { route: 'home', filters: { categoryId: 'all' }, selected: {}, cart: [] };

  function getProduct(productId) { return products.find((product) => product.id === productId); }
  function keyFor(productId, colorId, size) { return `${productId}:${colorId}:${size}`; }

  function serializeCart(cart) {
    return cart.map(({ productId, colorId, size, quantity }) => ({ productId, colorId, size, quantity }));
  }

  function restoreCart(records, currentProducts) {
    if (!Array.isArray(records)) return [];
    return records.reduce((cart, record) => {
      if (!record || !Number.isInteger(record.quantity) || record.quantity <= 0) return cart;
      const product = currentProducts.find((item) => item.id === record.productId);
      const variant = product && Core.getProductVariant(product, record.colorId, record.size);
      const color = product?.colors.find((item) => item.id === record.colorId);
      if (!product || !variant?.available || !color) return cart;
      return [...cart, {
        key: keyFor(product.id, color.id, record.size), productId: product.id, colorId: color.id,
        colorName: color.name, size: record.size, quantity: record.quantity, available: true,
        name: product.name, price: product.price,
      }];
    }, []);
  }

  function readCart() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(CART_STORAGE_KEY) || '[]');
      return restoreCart(parsed, products);
    } catch (_error) { return []; }
  }

  function saveCart() {
    try { global.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializeCart(state.cart))); } catch (_error) { /* memory-only cart */ }
  }

  function setToast(message) { toast.textContent = message; }

  function renderNavigation() {
    const current = state.route.startsWith('product:') ? 'catalog' : state.route;
    bottomNav.innerHTML = `<button type="button" data-action="navigate" data-route="home" aria-current="${current === 'home' ? 'page' : 'false'}">Главная</button><button type="button" data-action="navigate" data-route="catalog" aria-current="${current === 'catalog' ? 'page' : 'false'}">Каталог</button><button type="button" data-action="navigate" data-route="cart" aria-current="${current === 'cart' ? 'page' : 'false'}">Корзина</button>`;
  }

  function render() {
    const cartSummary = Core.getCartSummary(state.cart);
    cartBadge.textContent = String(cartSummary.count);
    renderNavigation();
    if (state.route === 'home') screen.innerHTML = UI.renderHome({ products, cartSummary });
    else if (state.route === 'catalog') screen.innerHTML = UI.renderCatalog({ products: Core.filterProducts(products, state.filters), categories, filters: state.filters, cartSummary });
    else if (state.route === 'cart') screen.innerHTML = UI.renderCart({ cart: state.cart, cartSummary });
    else if (state.route.startsWith('product:')) {
      const product = getProduct(state.route.slice('product:'.length));
      const selected = state.selected[product?.id] || {};
      screen.innerHTML = UI.renderProduct({ product, selected, cartSummary });
    } else {
      state.route = 'home';
      screen.innerHTML = UI.renderHome({ products, cartSummary });
    }
  }

  function navigate(route, historyMethod = 'push') {
    state.route = route;
    if (historyMethod === 'push') platform.push(route);
    if (historyMethod === 'replace') platform.replace(route);
    render();
  }

  async function share(productId) {
    const product = getProduct(productId);
    const result = await platform.share({ title: product?.name || 'Демо-витрина', text: 'Тестовая модель из локальной витрины', url: global.location.href || global.location.hash || '' });
    setToast(result === 'copied' ? 'Ссылка скопирована.' : result === 'manual' ? 'Скопируйте адрес страницы из строки браузера.' : '');
  }

  function dispatch(payload) {
    const action = payload?.action;
    if (!['navigate', 'filter-category', 'select-color', 'select-size', 'add-cart', 'change-quantity', 'checkout', 'share'].includes(action)) return;
    if (action === 'navigate') navigate(payload.route);
    if (action === 'filter-category') { state.filters.categoryId = payload.categoryId || 'all'; navigate('catalog', 'replace'); }
    if (action === 'select-color' || action === 'select-size') {
      const product = getProduct(payload.productId);
      if (!product) return;
      const previous = state.selected[product.id] || {};
      const colorId = action === 'select-color' ? payload.colorId : previous.colorId || product.colors[0]?.id;
      const firstAvailable = product.variants.find((variant) => variant.colorId === colorId && variant.available)?.size || '';
      state.selected[product.id] = { colorId, size: action === 'select-size' ? payload.size : firstAvailable };
      render();
    }
    if (action === 'add-cart') {
      const product = getProduct(payload.productId);
      const variant = product && Core.getProductVariant(product, payload.colorId, payload.size);
      const color = product?.colors.find((item) => item.id === payload.colorId);
      if (!product || !variant?.available || !color) return;
      state.cart = Core.addCartItem(state.cart, { key: keyFor(product.id, color.id, payload.size), productId: product.id, colorId: color.id, colorName: color.name, size: payload.size, name: product.name, price: product.price, available: true });
      saveCart(); render(); setToast('Тестовая позиция добавлена в корзину.');
    }
    if (action === 'change-quantity') { state.cart = Core.setCartQuantity(state.cart, payload.key, Number(payload.quantity)); saveCart(); render(); }
    if (action === 'checkout') setToast('Оформление появится после подключения нового backend.');
    if (action === 'share') share(payload.productId);
  }

  function clickHandler(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    dispatch({ action: target.dataset.action, route: target.dataset.route, categoryId: target.dataset.categoryId, productId: target.dataset.productId, colorId: target.dataset.colorId, size: target.dataset.size, key: target.dataset.key, quantity: target.dataset.quantity });
  }

  function init() {
    state.cart = readCart();
    state.route = global.location.hash.replace(/^#\//, '') || 'home';
    screen.addEventListener('click', clickHandler);
    bottomNav.addEventListener('click', clickHandler);
    global.document.querySelector('.topbar')?.addEventListener('click', clickHandler);
    platform.onPopState((route) => { state.route = route; render(); });
    render();
  }

  const api = { init, dispatch, serializeCart, restoreCart };
  if (typeof module !== 'undefined') module.exports = api;
  global.BrowserStoreApp = api;
}(window));
