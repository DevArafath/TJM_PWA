const CACHE_NAME = "tjm-pwa-v1";const CACHE_NAME = "tjm-pwa-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/app.js",
    "./manifest.json",
    "./images/logo.png",
    "./images/icon-192.png",
    "./images/icon-512.png",
    "./images/icon-maskable-512.png"
];

/* Install */
self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});


/* Activate */
self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(names => {

            return Promise.all(
                names
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );

        })
    );

    self.clients.claim();
});


/* Fetch */
self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cached => {

                return cached || fetch(event.request);

            })

    );

});