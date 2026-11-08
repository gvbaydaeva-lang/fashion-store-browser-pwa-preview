(function attachBrowserStoreCore(global) {
  function filterProducts(products, { categoryId = 'all', size = null } = {}) {
    return products.filter((product) =>
      (categoryId === 'all' || product.categoryId === categoryId)
      && (!size || product.variants.some((variant) => variant.size === size && variant.available)));
  }

  function getProductVariant(product, colorId, size) {
    return product?.variants.find((variant) => variant.colorId === colorId && variant.size === size) || null;
  }

  function addCartItem(cart, item) {
    if (!item.available) return [...cart];
    const found = cart.find((entry) => entry.key === item.key);
    return found
      ? cart.map((entry) => entry.key === item.key ? { ...entry, quantity: entry.quantity + 1 } : entry)
      : [...cart, { ...item, quantity: 1 }];
  }

  function setCartQuantity(cart, key, quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) return cart.filter((entry) => entry.key !== key);
    return cart.map((entry) => entry.key === key ? { ...entry, quantity } : entry);
  }

  function getCartSummary(cart) {
    return cart.reduce((summary, item) => ({
      count: summary.count + item.quantity,
      total: summary.total + item.price * item.quantity,
    }), { count: 0, total: 0 });
  }

  const api = { filterProducts, getProductVariant, addCartItem, setCartQuantity, getCartSummary };
  if (typeof module !== 'undefined') module.exports = api;
  if (global) global.BrowserStoreCore = api;
}(typeof window === 'undefined' ? null : window));
