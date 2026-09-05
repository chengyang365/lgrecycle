const CACHE_NAME = 'sjkc-recycle-__BUILD_ID__';
const APP_SHELL = ['./', './index.html', './tailwind.css', './site.webmanifest'];

const cacheResponse = async (request, response) => {
  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
};

const networkFirst = async (request) => {
  try {
    return await cacheResponse(request, await fetch(request));
  } catch {
    return (await caches.match(request)) || (await caches.match('./index.html'));
  }
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  return cacheResponse(request, await fetch(request));
};

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('sjkc-recycle-') && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  const isAppDocument = request.mode === 'navigate' ||
    new URL(request.url).pathname.endsWith('/index.html');
  event.respondWith(isAppDocument ? networkFirst(request) : cacheFirst(request));
});
