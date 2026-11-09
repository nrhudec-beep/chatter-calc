// Offline cache for the Stickout Chatter Calculator.
// Bump VERSION whenever index.html changes so phones pick up the new copy.
const VERSION = "chatter-v1";
const LOCAL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png"
];
// Loaded from the web on first launch, then kept for offline use.
const REMOTE = [
  "https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.27.0/plotly.min.js",
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
];
const REMOTE_HOSTS = ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(LOCAL);
    // Remote files are best-effort: installing offline must still succeed.
    await Promise.all(REMOTE.map(async (u) => {
      try { const r = await fetch(u, { mode: "cors" }); if (r.ok) await c.put(u, r); } catch (_) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // The page itself: try the network first so updates show up, fall back to cache offline.
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        // Give up on a weak shop-floor signal after 3 s and use the saved copy.
        const r = await Promise.race([
          fetch(req),
          new Promise((_, rej) => setTimeout(() => rej(new Error("slow")), 3000))
        ]);
        if (!r.ok) throw new Error("bad");
        const c = await caches.open(VERSION);
        c.put("./index.html", r.clone());
        return r;
      } catch (_) {
        return (await caches.match("./index.html")) || (await caches.match("./"));
      }
    })());
    return;
  }

  // Local files, Plotly and fonts: cache first, fill the cache from the network when missing.
  if (url.origin === location.origin || REMOTE_HOSTS.includes(url.hostname)) {
    e.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      try {
        const r = await fetch(req);
        if (r.ok || r.type === "opaque") (await caches.open(VERSION)).put(req, r.clone());
        return r;
      } catch (_) {
        return new Response("", { status: 504, statusText: "Offline" });
      }
    })());
  }
});
