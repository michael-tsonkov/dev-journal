(function Blog() {
    "use strict";

    var offlineIcon;
    var isOnline = !!navigator.onLine;
    var isLoggedIn = /isLoggedIn=1/.test(document.cookie.toString() || "");
    var usingSW = ("serviceWorker" in navigator);
    var swRegistration;
    let svcworker;

    document.addEventListener("DOMContentLoaded", ready, false);

    initServiceWorker().catch(console.error);

    function ready() {
        offlineIcon = document.getElementById("connectivity-status");

        if (!isOnline) {
            offlineIcon.classList.remove("hidden");
        }

        window.addEventListener("online", function online() {
            offlineIcon.classList.add("hidden");
            isOnline = true;
            sendStatusUpdate();
        });

        window.addEventListener("offline", function offline() {
            offlineIcon.classList.remove("hidden");
            isOnline = false;
            sendStatusUpdate();
        });
    };

    async function initServiceWorker() {
        swRegistration = await navigator.serviceWorker.register("/sw.js", {
            updateViaCache: 'none'
        });

        svcworker = swRegistration.installing || swRegistration.waiting || swRegistration.active;

        navigator.serviceWorker.addEventListener("controllerchange", function onControllerChange() {
            svcworker = navigator.serviceWorker.controller;
            sendStatusUpdate(svcworker);
        });

        navigator.serviceWorker.addEventListener("message", onMessage);
    }

    function onMessage(event) {
        var { data } = event;

        if (data.requestStatusUpdate) {
            console.log("Received status update request from service worker.");
            sendStatusUpdate(event.ports && event.ports[0]);
        }
    }

    function sendStatusUpdate(target) {
        console.log('sending status');
        sendSWMessage({ statusUpdate: { isOnline, isLoggedIn } }, target);
    }

    async function sendSWMessage(msg, target) {
        if (target) {
            target.postMessage(msg)
        }
        else if (svcworker) {
            svcworker.postMessage(msg);
        }
        else {
            navigator.serviceWorker.controller.postMessage(msg);
        }
    }
})();
