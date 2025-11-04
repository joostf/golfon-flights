self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // simple pass-through (no caching yet)
  // just to prove the SW is controlling requests
  console.log('[SW] Fetching:', event.request.url);
});
