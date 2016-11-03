"use strict";

importScripts("app/filesList.js");

var CACHE_NAME = 'sv-cache-v22';

self.addEventListener("install", (ev) => {	
    console.log('Installing version - ' + CACHE_NAME);
    // Perform install steps
    ev.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(siteFiles);
        }));
});

self.addEventListener("activate", (ev) => {

    ev.waitUntil(caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map(function (key) {
                if (CACHE_NAME.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );

});

self.addEventListener("message", ({ data }) => {
    console.log("got a message", data);
    switch(data.action){
        case "installUpdate": 
            self.skipWaiting();
            break;
    }
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
              function(response) {
                  // Check if we received a valid response
                  if(!response || response.status !== 200 || response.type !== 'basic') {
                      return response;
                  }

                  // IMPORTANT: Clone the response. A response is a stream
                  // and because we want the browser to consume the response
                  // as well as the cache consuming the response, we need
                  // to clone it so we have two streams.
                  var responseToCache = response.clone();

                  caches.open(CACHE_NAME)
                    .then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });

                  return response;
              }
            );
        })
      );
});

//self.addEventListener('fetch', function(event) {
//    event.respondWith(
//      fetch(event.request).catch(function() {
//          return caches.match(event.request);
//      })
//    );
//});

/*.addEventListener('fetch', (ev) => {

    var fetchRequest = ev.request.clone();

    ev.respondWith(

        fetch(fetchRequest).then(
              function(response) {
                  // Check if we received a valid response
                  if(!response || response.status !== 200 || response.type !== 'basic') {

                      caches.match(ev.request)
                        .then(function(response) {
                            // Cache hit - return response
                            if (response) {
                                return response;
                            }
                        });

                      return response;
                  }
                  
                  
                  var responseToCache = response.clone();

                  caches.open(CACHE_NAME)
                    .then(function(cache) {
                        cache.put(ev.request, responseToCache);
                    });

                  return response;
              }
            )
    );
});*/

/*
self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
              function(response) {
                  // Check if we received a valid response
                  if(!response || response.status !== 200 || response.type !== 'basic') {
                      return response;
                  }

                  // IMPORTANT: Clone the response. A response is a stream
                  // and because we want the browser to consume the response
                  // as well as the cache consuming the response, we need
                  // to clone it so we have two streams.
                  var responseToCache = response.clone();

                  caches.open(CACHE_NAME)
                    .then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });

                  return response;
              }
            );
        })
      );
});
*/
