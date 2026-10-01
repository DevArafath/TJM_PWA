/* =========================================================
   THAQWA JUMMAH MASJID
   Progressive Web App Service Worker
========================================================= */


/*
 * Change this version whenever you make important changes
 * to files that should be refreshed immediately.
 */
const CACHE_NAME = "thaqwa-masjid-v1";


/*
 * Files that should be available offline.
 *
 * We intentionally keep this list small for the first version.
 * Later we can add your JSON data files here.
 */
const APP_FILES = [
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


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", event => {

    console.log("Thaqwa Masjid PWA: Installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(APP_FILES);

            })

    );

    /*
     * Activate the new service worker immediately.
     */
    self.skipWaiting();

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", event => {

    console.log("Thaqwa Masjid PWA: Activated");

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => caches.delete(cacheName))

                );

            })

    );

    /*
     * Take control of open pages immediately.
     */
    self.clients.claim();

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", event => {

    /*
     * Only handle GET requests.
     */
    if (event.request.method !== "GET") {
        return;
    }


    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                /*
                 * If the file exists in the cache,
                 * return the cached version.
                 */
                if (cachedResponse) {
                    return cachedResponse;
                }


                /*
                 * Otherwise request it from the network.
                 */
                return fetch(event.request)
                    .then(networkResponse => {

                        /*
                         * Save successful responses for
                         * future offline use.
                         */
                        if (
                            networkResponse &&
                            networkResponse.status === 200 &&
                            networkResponse.type === "basic"
                        ) {

                            const responseToCache =
                                networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(
                                        event.request,
                                        responseToCache
                                    );

                                });

                        }


                        return networkResponse;

                    });

            })

    );

});
