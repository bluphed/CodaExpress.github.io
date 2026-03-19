const CACHE_NAME = 'coda-express-v1';
const BASE_PATH = '/CodaExpress.github.io';

const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyDFR0mPU-jz-crPgioPus5UEdfeEZ90yk4&libraries=geometry,places'
];

self.addEventListener('install', event => {
  console.log('Service Worker instalándose...');
  self.skipWaiting(); // Activar inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Error cacheando archivos:', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Si falla la red y no está en caché, muestra página offline
          if (event.request.mode === 'navigate') {
            return caches.match(BASE_PATH + '/index.html');
          }
        });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activado!');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tomar control de todas las páginas abiertas inmediatamente
      return self.clients.claim();
    })
  );
});
