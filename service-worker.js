//sets up index page in the cache
self.addEventListener('install', function (event) {
    var indexPage = new Request('index.html');
    event.waitUntil(
        fetch(indexPage).then(function (response) {
            return caches.open('Offline').then(function (cache) {
                console.log("Cached indexPage during install" + response.url);
                return cache.put(indexPage, response);
            });
        }));
});
self.addEventListener('fetch', function (event) {
    console.log("Service worker fetching from request url " + event.request.url);
    if (event.request.method !== 'GET') {
        console.log("Fetch event ignored", event.request.method, event.request.url);
        return;
    }
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(
                function (response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    var cacheCopy = response.clone();
                    console.log("Fetch response from network " + event.request.url);
                    caches.open('Offline').then(function (cache) {
                        cache.put(event.request, cacheCopy);
                    });
                    return response;
                }
            );
        })

    );
});

self.addEventListener('activate', function (event) {
    console.log("Service worker activated");
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (thisCacheName) {
                if (thisCacheName !== cacheNames) {
                    console.log("Removing cached files from cache", thisCacheName);
                    return caches.delete(thisCacheName);
                }
            })
            );

        })
    );
});
