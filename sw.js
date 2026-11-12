const CACHE = "treino-exames-v3";
const FILES = [
  "./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png",
  "dados-mat.js", "dados-qui.js", "dados-por.js", "dados-his.js", "dados-geo.js", "dados-bio.js", "dados-exames.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Abre logo a versão guardada e actualiza em segundo plano quando há internet.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(async c => {
      const hit = await c.match(e.request);
      const net = fetch(e.request)
        .then(res => { if (res && res.ok) c.put(e.request, res.clone()); return res; })
        .catch(() => hit || c.match("index.html"));
      return hit || net;
    })
  );
});
