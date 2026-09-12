/* shoooot — 설치 조건을 만족시키기 위한 최소 서비스워커.
   캐시를 적극적으로 하지 않는다. 앱이 늘 최신이어야 하고, 저장은 어차피 네트워크가 필요하다. */
const SHELL = 'shoooot-shell-2026-09-12-6';
const SHELL_FILES = ["./shooot-app.html", "./mobile/manifest.webmanifest", "./mobile/icons/icon-192.png"];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* 네트워크 우선 — 오프라인일 때만 캐시된 껍데기를 돌려준다 */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(SHELL).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./shooot-app.html')))
  );
});
