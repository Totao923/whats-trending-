// ============================================================
//  SERVICE WORKER — Whats Trending PWA
//
//  Strategy:
//  - HTML + JS files  → network-first (always fresh, cache as offline fallback)
//  - CSS + images     → cache-first (fast, rarely change)
//  - Supabase API     → network only, never cached
// ============================================================

const CACHE_NAME = 'trending-eats-v4';

const NETWORK_FIRST = ['/index.html', '/login.html', '/admin.html', '/app.js', '/config.js'];
const CACHE_FIRST   = ['/styles.css', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

// Install: pre-cache everything
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([...NETWORK_FIRST, ...CACHE_FIRST])
    )
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET over http/https
  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;

  // Never cache Supabase or CDN requests
  if (request.url.includes('supabase.co') || request.url.includes('jsdelivr.net')) return;

  const path = new URL(request.url).pathname;

  // Network-first: always try network, fall back to cache if offline
  if (NETWORK_FIRST.some((p) => path === p || path.endsWith(p))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first: serve from cache, update in background
  if (CACHE_FIRST.some((p) => path === p || path.endsWith(p))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
        return cached || network;
      })
    );
    return;
  }

  // Everything else: network only
  event.respondWith(fetch(request));
});
