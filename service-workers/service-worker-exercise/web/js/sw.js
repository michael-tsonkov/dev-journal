"use strict";

// TODO

const version = 1;
var isOnline = true;
var isLoggedIn = false;

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("message", onMessage);

main().catch(console.error);

async function main() {
    await sendMessage({ requestStatusUpdate: true });
}

async function onInstall(event) {
    console.log(`Service Worker (${version}) is installing.`);
    self.skipWaiting(); // Skip waiting to activate immediately
}

async function sendMessage(msg) {
    var allClients = await clients.matchAll({ includeUncontrolled: true });

    return Promise.all(
        allClients.map(function clientMsg(client) {
            var channel = new MessageChannel();
            channel.port1.onmessage = onMessage
            return client.postMessage(msg, [channel.port2]);
        })
    );
}

function onMessage({ data }) {
    if (data.statusUpdate) {
        ({ isOnline, isLoggedIn } = data.statusUpdate);
        console.log(`Service Worker (v${version}) status update: isOnline=${isOnline}, isLoggedIn=${isLoggedIn}`);
    }
}

async function onActivate(event) {
    event.waitUntil(handleActivation());
}

async function handleActivation() {
    await clients.claim();
    console.log(`Service Worker (${version}) is activating.`);
} 
