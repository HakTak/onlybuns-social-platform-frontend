const CACHE_NAME = 'image-cache-v1';
const IMAGE_URL_PATTERN = /\/api\/posts\/images\/.*\.(?:png|jpg|jpeg|gif|svg)$/;

self.addEventListener('install', event => {
  //console.log('Service Worker installing.');
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  //console.log('Fetch event for:', event.request.url);
  // Check if the request URL matches the image pattern
  if (IMAGE_URL_PATTERN.test(event.request.url)) {
    //console.log('Fetching image:', event.request.url);
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('Found in cache:', event.request.url);
            return response;
          }
          //console.log('Not found in cache, fetching from network:', event.request.url);
          return fetch(event.request, { mode: 'cors' }).then(
            response => {
              //console.log('Network response:', response);
              if (!response || response.status !== 200) {
                console.log('Network request failed or not basic:', event.request.url);
                return response;
              }
              //console.log('Network request successful:', event.request.url);
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  //console.log('Opened cache:', CACHE_NAME);
                  cache.put(event.request, responseToCache)
                    .then(() => {
                      console.log('Image cached:', event.request.url);
                    })
                    .catch(error => {
                      console.error('Failed to cache image:', event.request.url, error);
                    });
                })
                .catch(error => {
                  console.error('Failed to open cache:', CACHE_NAME, error);
                });
              return response;
            }
          ).catch(error => {
            console.error('Fetch failed:', event.request.url, error);
          });
        })
    );
  } else {
    //console.log('Request does not match image pattern:', event.request.url);
  }
});

self.addEventListener('activate', event => {
  //console.log('Service Worker activating.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});