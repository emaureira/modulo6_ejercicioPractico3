const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = ["/", "/index.html", "/main.js", "/icons/icon-192x192.png", "/assets/data/data.json", "/assets/data/servicios.json"];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
      caches.keys().then((cacheNames) => {
          return Promise.all(
              cacheNames.filter((cacheName) => {
                  return cacheName !== CACHE_NAME;
              }).map((cacheName) => {
                  return caches.delete(cacheName); 
              })
          );
      })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request).then(cachedResponse => {
              if (cachedResponse) {
                  return cachedResponse;
              }

              return fetch(event.request).then(networkResponse => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
              })
               .catch(error => {
                   console.error('Error fetching from network:', error);
                   return new Response('Error de red', { status: 500, statusText: 'Internal Server Error' })
               });
           });
      })
  );
});