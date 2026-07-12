/* MathQuest service worker — offline shell for patchy classroom wi-fi.
   Strategy: cache-first-with-revalidate for same-origin GETs, falling
   back to a cached /offline page when both cache and network miss. */
const CACHE = "mathquest-v1";
const CORE = ["/", "/explore", "/offline"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {})));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") cache.put(req, res.clone());
          return res;
        })
        .catch(async () => cached || (await cache.match("/offline")) || Response.error());
      return cached || network;
    })(),
  );
});
