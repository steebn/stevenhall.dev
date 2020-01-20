const cacheName = 'cache-v1';
const precacheResources = [
  '/',
  'index.html',
  'styles/main.min.css',
  'scripts/main.min.js',
  'images/logoUU.png',
  'images/touch/icon-128x128.png',
  'images/touch/icon-192x192.png',
  'images/touch/icon-256x256.png',
  'images/touch/icon-384x384.png',
  'images/touch/icon-512x512.png',
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetchAndUpdate(event.request);
      })
    );
});

async function fetchAndUpdate(request) {
  return fetch(request).then(async res=>{
    if (res) {
      return caches.open(cacheName).then(async cache=>{
        return cache.put(request, res.clone()).then(()=>res);
      });
    }
  });
}