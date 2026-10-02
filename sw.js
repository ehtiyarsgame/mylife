// Çevrimdışı oynanış için basit önbellek (önce ağ, düşerse önbellek).
const CACHE = 'hayatyolu-v18';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html', 'css/style.css', 'js/main.js', 'data/events.json', 'data/questions.json', 'data/events.en.json', 'data/questions.en.json', 'icons/icon.svg', 'icons/studio.svg'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request)));
});
