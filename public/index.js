/*** DOM elements ***/

const startID = document.getElementById('start');
const retryID = document.getElementById('retry');
const pullID = document.getElementById('pull');
const finishID = document.getElementById('finish');
const mainID = document.getElementById('main');
const cardPulled = document.getElementById('card-pulled');
const cardPoints = document.getElementById('card-points');
const spinnerLoading = document.getElementById('spinner-block');
const deck = document.getElementById('deck');

/*** Variables ***/

let gameIsOver = false;
let cards = [];
let pulledCardCount = -1;

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
    pulledCardCount ++;

    // retrieve cards from local storage
    cards = JSON.parse(localStorage.getItem('cards'));

    // get random card
    let randomIndexCard = getRandomInt(cards.length);
    let randomCard = cards[randomIndexCard];

    // new card
    let newCard = document.createElement("img");

    // new cards properties ...
    newCard.src = randomCard.images.svg;
    newCard.classList.add(randomCard.code);
    newCard.classList.add("defaultCardStyle ");

    if (pulledCardCount > 0) {
        newCard.style.left = JSON.stringify(pulledCardCount * 15) + "px";
    }

    deck.appendChild(newCard);
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
                localStorage.setItem('cards', JSON.stringify(data.cards));
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

/**
 * Get random number according to max range
 * @param {integer} max Maximal number
 * @returns Random number
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
