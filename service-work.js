//Offline copy of pages service worker

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
//if fetch fails it will look for the request in the cache
self.addEventListener('fetch', function (event) {
    var updateCache = function (request) {
        const clonedRequest = event.request.clone();
        return caches.open('Offline').then(function (cache) {
            return fetch(clonedRequest).then(function (response) {
                console.log("Add page to offline" + response.url);
                return cache.put(request, response);
            });
        });
    };

    event.waitUntil(updateCache(event.request));
    event.respondWith(
        fetch(event.request).catch(function (error) {
            console.log("Network request failed.Serving content from cache" + error);
            //check to see if you have it in the cache, return response.
            //if not, return error page
            return caches.open('Offline').then(function (cache) {
                return cache.match(event.request).then(function (matching) {
                    var report = !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
                    return report;
                });
            });
        })
    );
});
