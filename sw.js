const version = '1.0';
const assets = [
    'index.html',
    'assets/images/giphy.png',
    'assets/js/main.js',
    'assets/styles/style.css'
];
const CACHE_KEYS = {
  static: `static-${version}`,
  dynamic: `dynamic-${version}`,
};

self.addEventListener('install', async (event) => {
  self.skipWaiting();

  event.waitUntil(
      caches.open(CACHE_KEYS.static).then(cache => cache.addAll(assets))
  )
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key.indexOf(version) === -1)
          .map(key => caches.delete(key))
      )
    })
  )
});

const tryCacheFirstStrategy = (request, cacheKey = version) => {
  return caches.match(request).then(cachedResponse => {
    if (cachedResponse) {
      return cachedResponse;
    }

    return fetch(request).then(networkResponse => {
      return caches.open(cacheKey).then(cache => {
        cache.put(request, networkResponse.clone());

        return networkResponse;
      })
    })
  })
}

const tryNetworkFirstStrategy = (request, cacheKey = version) => {
  return fetch(request).then(networkResponse => {
    if (!networkResponse.ok) {
      throw new Error('Not ok response');
    }

    return caches.open(cacheKey).then(cache => {
      cache.put(request, networkResponse.clone());

      return networkResponse;
    });
  }).catch(error => {
    return caches.match(request);
  })
}

self.addEventListener('fetch', (event) => {
  if (event.request.url.match(location.origin) || event.request.url.match('giphy.com/media')) {
    event.respondWith(tryCacheFirstStrategy(event.request, CACHE_KEYS.static));
  } else if (event.request.url.match('api.giphy.com')) {
    event.respondWith(tryNetworkFirstStrategy(event.request, CACHE_KEYS.dynamic));
  }
});