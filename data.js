(function attachBrowserStoreData(global) {
  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'outerwear', name: 'Верхняя одежда' },
    { id: 'dresses', name: 'Платья' },
    { id: 'knitwear', name: 'Трикотаж' },
    { id: 'trousers', name: 'Брюки' },
  ];

  const products = [
    {
      id: 'sample-coat', name: 'Демопальто', categoryId: 'outerwear', price: 4500,
      description: 'Тестовая карточка свободного силуэта для прохладной погоды.',
      visual: { tone: 'sand', label: 'Пальто' },
      colors: [{ id: 'sand', name: 'Песочный' }, { id: 'graphite', name: 'Графитовый' }],
      variants: [
        { colorId: 'sand', size: 'S', available: true }, { colorId: 'sand', size: 'M', available: false },
        { colorId: 'sand', size: 'L', available: true }, { colorId: 'graphite', size: 'S', available: true },
        { colorId: 'graphite', size: 'M', available: true }, { colorId: 'graphite', size: 'L', available: false },
      ],
    },
    {
      id: 'sample-dress', name: 'Демоплатье', categoryId: 'dresses', price: 3200,
      description: 'Тестовая модель с мягкой посадкой и лаконичным кроем.',
      visual: { tone: 'rose', label: 'Платье' },
      colors: [{ id: 'rose', name: 'Розовый' }, { id: 'ink', name: 'Чернильный' }],
      variants: [
        { colorId: 'rose', size: 'S', available: true }, { colorId: 'rose', size: 'M', available: true },
        { colorId: 'rose', size: 'L', available: false }, { colorId: 'ink', size: 'S', available: false },
        { colorId: 'ink', size: 'M', available: true }, { colorId: 'ink', size: 'L', available: true },
      ],
    },
    {
      id: 'sample-cardigan', name: 'Демокардиган', categoryId: 'knitwear', price: 2800,
      description: 'Тестовый кардиган для многослойных образов.', visual: { tone: 'sage', label: 'Кардиган' },
      colors: [{ id: 'sage', name: 'Шалфейный' }],
      variants: [{ colorId: 'sage', size: 'S', available: true }, { colorId: 'sage', size: 'M', available: true }, { colorId: 'sage', size: 'L', available: true }],
    },
    {
      id: 'sample-trousers', name: 'Демобрюки', categoryId: 'trousers', price: 3600,
      description: 'Тестовые брюки с прямым силуэтом.', visual: { tone: 'clay', label: 'Брюки' },
      colors: [{ id: 'clay', name: 'Терракотовый' }],
      variants: [{ colorId: 'clay', size: 'S', available: false }, { colorId: 'clay', size: 'M', available: true }, { colorId: 'clay', size: 'L', available: true }],
    },
    {
      id: 'sample-jacket', name: 'Демокуртка', categoryId: 'outerwear', price: 5100,
      description: 'Тестовая короткая куртка с объёмным воротником.', visual: { tone: 'sky', label: 'Куртка' },
      colors: [{ id: 'sky', name: 'Небесный' }],
      variants: [{ colorId: 'sky', size: 'S', available: true }, { colorId: 'sky', size: 'M', available: false }, { colorId: 'sky', size: 'L', available: true }],
    },
    {
      id: 'sample-skirt', name: 'Демоюбка', categoryId: 'dresses', price: 2400,
      description: 'Тестовая юбка миди с удобной посадкой.', visual: { tone: 'plum', label: 'Юбка' },
      colors: [{ id: 'plum', name: 'Сливовый' }],
      variants: [{ colorId: 'plum', size: 'S', available: true }, { colorId: 'plum', size: 'M', available: true }, { colorId: 'plum', size: 'L', available: false }],
    },
    {
      id: 'sample-vest', name: 'Деможилет', categoryId: 'knitwear', price: 2100,
      description: 'Тестовый жилет для повседневного комплекта.', visual: { tone: 'lemon', label: 'Жилет' },
      colors: [{ id: 'lemon', name: 'Лимонный' }],
      variants: [{ colorId: 'lemon', size: 'S', available: true }, { colorId: 'lemon', size: 'M', available: true }, { colorId: 'lemon', size: 'L', available: true }],
    },
  ];

  global.BrowserStoreData = { categories, products };
}(window));
