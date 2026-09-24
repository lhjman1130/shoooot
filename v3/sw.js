/* shoooot 3 — 설치용 최소 서비스워커. 네트워크 우선, 오프라인일 때만 껍데기. */
const SHELL = 'shoooot3-shell-3.4';
const SHELL_FILES = ["./shooot-app.html", "./mobile/manifest.webmanifest", "./mobile/icons/icon-192.png"];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('shoooot3-') && k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)).catch(() => {}); return res; })
    .catch(() => caches.match(req).then(hit => hit || caches.match('./shooot-app.html'))));
});
