"use strict";

var curFib = 0;

self.postMessage("Hello from the web worker!");
// **********************************
self.onmessage = onMessage;

function onMessage(event) {
    getNextFib();
}

function getNextFib() {
    var fibNumber = fib(curFib);
    self.postMessage({
        fib: fibNumber,
        index: curFib
    });
    curFib++;
    getNextFib();
}

function fib(n) {
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}
