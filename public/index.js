const startID = document.getElementById("start");
const retryID = document.getElementById("retry");
const drawID = document.getElementById("draw");
const finishID = document.getElementById("finish");
const mainID = document.getElementById("main");

let gameIsOver = false;

/*** Events ***/

startID.addEventListener("click", function() {
    start();
});

retryID.addEventListener("click", function() {
    retry();
});

finishID.addEventListener("click", function() {
    console.log('Finish');
    finish();
});

drawID.addEventListener("click", function() {
    console.log('draw');
});

/*** Functions ***/

function start() {
    startID.classList.add("hidden");    
    mainID.classList.remove("hidden");
}

function finish() {
    retryID.classList.remove("none");
}

function retry() {
    retryID.classList.add("none");    
}
