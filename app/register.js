"use strict";

(function () {

    if (!navigator.serviceWorker.controller) {
        console.log("first time serviceworker is loaded and running...");
        //return;
    }else {
        console.log("A version of service worker is loaded and running...");
    }

    function updateConfirmation(sw) {
        if (confirm("There is an updated version available. Install now ?")) {
            sw.postMessage({ action: "installUpdate" });
        }
    }

    function trackInstalation(sw) {
        if (sw.addEventListner) {
            sw.addEventListner("statechange", () => {
                if (sw.state === "installed") {
                    updateConfirmation(sw);
                }
            });
        }
    }

    if ('serviceWorker' in navigator) {

        console.log('service worker api is present');

        navigator.serviceWorker.register('/sw.js').then(function (reg) {

            if (reg.installing) {
                console.log('New versioni installing...');
                trackInstalation(reg.installing);
            } else if (reg.waiting) {
                console.log('New version available to install...');
                updateConfirmation(reg.waiting);
            } else if (reg.active) {
                console.log('Service worker active');
            }

        }).catch(function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });

    } else {
        console.log('service worker api is not present in the browser');
    }

})();








