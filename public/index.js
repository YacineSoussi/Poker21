/*** DOM elements ***/

const startID = document.getElementById('start');
const retryID = document.getElementById('retry');
const pullID = document.getElementById('pull');
const finishID = document.getElementById('finish');
const mainID = document.getElementById('main');
const cardPulled = document.getElementById('card-pulled');
const cardPoints = document.getElementById('card-points');
const spinnerLoading = document.getElementById('spinner-block');

/*** Variables ***/

let gameIsOver = false;

/*** Events ***/

startID.addEventListener('click', function() {
    start();
});

retryID.addEventListener('click', function() {
    retry();
});

finishID.addEventListener('click', function() {
    finish();
});

pullID.addEventListener('click', function() {
    // TODO ...
});

/*** Functions ***/

/**
 * Start the game
 * - Loading cards
 * - Enable or disable DOM elements
 */
function start() {
    const deck = new Deck();

    // DOM elements manipulation
    startID.classList.add('d-none');
    spinnerLoading.classList.remove('d-none');

    // retrieve cards data
    deck.getCardsData()
        .then(data => {
            if (data.cards.length) {
                deck.setCards(data.cards);
                mainID.classList.remove('hidden');
                spinnerLoading.classList.add('d-none');
            }
        })
        .catch(error => {
            throw new Error(error);
        });
}

/**
 * Finish the game
 * - Enable or disable DOM elements
 */
function finish() {
    retryID.classList.remove('d-none');
}

/**
 * Retry the game
 * - Enable or disable DOM elements
 */
function retry() {
    retryID.classList.add('d-none');
}
