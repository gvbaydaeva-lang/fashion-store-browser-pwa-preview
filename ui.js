(function attachBrowserStoreUI(global) {
  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    }[character]));
  }

  function money(value) { return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`; }

  function cartLink(cartSummary) {
    return `<button type="button" class="cart-link" data-action="navigate" data-route="cart" aria-label="Открыть корзину">Корзина <span class="cart-badge">${cartSummary.count}</span></button>`;
  }

  function productTile(product) {
    return `<article class="product-tile">
      <button type="button" class="product-visual tone-${escapeHtml(product.visual.tone)}" data-action="navigate" data-route="product:${escapeHtml(product.id)}" aria-label="Открыть ${escapeHtml(product.name)}">
        <span>${escapeHtml(product.visual.label)}</span>
      </button>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${money(product.price)}</p>
      <button type="button" class="text-button" data-action="navigate" data-route="product:${escapeHtml(product.id)}">Подробнее</button>
    </article>`;
  }

  function renderHome({ products, cartSummary }) {
    return `<section class="hero"><p class="eyebrow">Демо-коллекция</p><h1>Новинки</h1><p>Нейтральные тестовые модели для просмотра в браузере.</p><button type="button" class="primary-button" data-action="navigate" data-route="catalog">Перейти в каталог</button></section>
      <section class="section-heading"><h2>Выбрано для витрины</h2>${cartLink(cartSummary)}</section>
      <section class="product-grid">${products.slice(0, 4).map(productTile).join('')}</section>`;
  }

  function renderCatalog({ products, categories, filters = {}, cartSummary }) {
    const selected = filters.categoryId || 'all';
    const categoryButtons = categories.map((category) => `<button type="button" class="filter-button${category.id === selected ? ' is-selected' : ''}" data-action="filter-category" data-category-id="${escapeHtml(category.id)}" aria-pressed="${category.id === selected}">${escapeHtml(category.name)}</button>`).join('');
    const empty = products.length ? products.map(productTile).join('') : '<p class="empty-state">Подходящих тестовых моделей пока нет.</p>';
    return `<section class="section-heading"><div><p class="eyebrow">Каталог</p><h1>Тестовые модели</h1></div>${cartLink(cartSummary)}</section>
      <div class="filters" aria-label="Категории">${categoryButtons}</div><section class="product-grid">${empty}</section>`;
  }

  function renderProduct({ product, selected, cartSummary }) {
    if (!product) return '<section class="empty-state"><h1>Модель не найдена</h1><button type="button" data-action="navigate" data-route="catalog">Вернуться в каталог</button></section>';
    const colorId = selected?.colorId || product.colors[0]?.id;
    const size = selected?.size || product.variants.find((variant) => variant.colorId === colorId && variant.available)?.size || '';
    const colors = product.colors.map((color) => `<button type="button" class="color-button${color.id === colorId ? ' is-selected' : ''}" data-action="select-color" data-product-id="${escapeHtml(product.id)}" data-color-id="${escapeHtml(color.id)}" aria-pressed="${color.id === colorId}">${escapeHtml(color.name)}</button>`).join('');
    const sizes = [...new Set(product.variants.filter((variant) => variant.colorId === colorId).map((variant) => variant.size))].map((variantSize) => {
      const variant = product.variants.find((item) => item.colorId === colorId && item.size === variantSize);
      const unavailable = !variant?.available;
      return `<button type="button" class="size-button${variantSize === size ? ' is-selected' : ''}" data-action="select-size" data-product-id="${escapeHtml(product.id)}" data-size="${escapeHtml(variantSize)}"${unavailable ? ' disabled aria-disabled="true"' : ' aria-pressed="' + (variantSize === size) + '"'}>${escapeHtml(variantSize)}</button>`;
    }).join('');
    return `<section class="section-heading"><button type="button" class="text-button" data-action="navigate" data-route="catalog">← Каталог</button>${cartLink(cartSummary)}</section>
      <article class="product-detail"><div class="product-visual detail-visual tone-${escapeHtml(product.visual.tone)}"><span>${escapeHtml(product.visual.label)}</span></div><div><p class="eyebrow">Тестовая модель</p><h1>${escapeHtml(product.name)}</h1><p class="price">${money(product.price)}</p><p>${escapeHtml(product.description)}</p><fieldset><legend>Цвет</legend><div class="choice-row">${colors}</div></fieldset><fieldset><legend>Размер</legend><div class="choice-row">${sizes}</div></fieldset><button type="button" class="primary-button" data-action="add-cart" data-product-id="${escapeHtml(product.id)}" data-color-id="${escapeHtml(colorId)}" data-size="${escapeHtml(size)}">Добавить в корзину</button><button type="button" class="text-button" data-action="share" data-product-id="${escapeHtml(product.id)}">Поделиться</button></div></article>`;
  }

  function renderUnavailableCheckout() {
    return '<p class="notice" role="status">Оформление появится после подключения нового backend.</p>';
  }

  function renderCart({ cart, cartSummary }) {
    const items = cart.length ? cart.map((item) => `<li class="cart-item"><div><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.colorName)}, размер ${escapeHtml(item.size)}</p><p>${money(item.price)}</p></div><div class="quantity-control" aria-label="Количество ${escapeHtml(item.name)}"><button type="button" data-action="change-quantity" data-key="${escapeHtml(item.key)}" data-quantity="${item.quantity - 1}" aria-label="Уменьшить количество">−</button><span>${item.quantity}</span><button type="button" data-action="change-quantity" data-key="${escapeHtml(item.key)}" data-quantity="${item.quantity + 1}" aria-label="Увеличить количество">+</button></div></li>`).join('') : '<li class="empty-state">Корзина пока пуста.</li>';
    return `<section class="section-heading"><div><p class="eyebrow">Корзина</p><h1>Ваш выбор</h1></div>${cartLink(cartSummary)}</section><ul class="cart-list">${items}</ul><section class="cart-total"><p>Итого: <strong>${money(cartSummary.total)}</strong></p><button type="button" class="primary-button" data-action="checkout"${cart.length ? '' : ' disabled'}>Продолжить</button>${renderUnavailableCheckout()}</section>`;
  }

  const api = { renderHome, renderCatalog, renderProduct, renderCart, renderUnavailableCheckout };
  if (typeof module !== 'undefined') module.exports = api;
  if (global) global.BrowserStoreUI = api;
}(typeof window === 'undefined' ? null : window));
