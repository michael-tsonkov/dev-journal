(function Home() {
    "use strict";

    var startStopBtn;
    var fibsList;
    var worker;

    document.addEventListener("DOMContentLoaded", ready, false);


    // **********************************

    function ready() {
        startStopBtn = document.getElementById("start-stop-btn");
        fibsList = document.getElementById("fibs");

        startStopBtn.addEventListener("click", startFibs, false);
    }

    function renderFib(num, fib) {
        var p = document.createElement("div");
        p.innerText = `Fib(${num}): ${fib}`;
        if (fibsList.childNodes.length > 0) {
            fibsList.insertBefore(p, fibsList.childNodes[0]);
        }
        else {
            fibsList.appendChild(p);
        }
    }

    function startFibs() {
        startStopBtn.removeEventListener("click", startFibs, false);
        startStopBtn.addEventListener("click", stopFibs, false);

        startStopBtn.innerText = "Stop";
        fibsList.innerHTML = "";

        // TODO
        worker = new Worker("/js/worker.js");

        worker.addEventListener("message", onMessage);

        worker.postMessage("Start generating Fibonacci numbers");
    }

    function stopFibs() {
        startStopBtn.removeEventListener("click", stopFibs, false);
        startStopBtn.addEventListener("click", startFibs, false);

        startStopBtn.innerText = "Start";
        // TODO
        worker.terminate();
    }

    function onMessage(event) {
        renderFib(event.data.index, event.data.fib);
    }
})();
