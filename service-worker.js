const CACHE_NAME = 'browser-store-shell-v2';
const SHELL_ASSETS = [
  './', './index.html', './styles.css', './data.js', './core.js', './platform.js', './ui.js', './app.js',
  './manifest.webmanifest', './icons/icon-192.svg', './icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith('browser-store-shell-') && key !== CACHE_NAME)
    .map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const shellUrls = SHELL_ASSETS.map((asset) => new URL(asset, self.registration.scope).href);
  if (event.request.method !== 'GET' || !shellUrls.includes(url.href)) return;
  event.respondWith(caches.match(event.request).then((hit) => hit || fetch(event.request)));
});
