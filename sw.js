"use strict";

var CACHE_NAME = 'sv-cache-v19';

self.addEventListener("install", (ev) => {
    // Perform install steps
    ev.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            //return cache.addAll(urlsToCache);
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