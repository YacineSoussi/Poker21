/*** DOM elements ***/

const startID = document.getElementById("start");
const retryID = document.getElementById("retry");
const pullID = document.getElementById("pull");
const finishID = document.getElementById("finish");
const mainID = document.getElementById("main");
const cardPulled = document.getElementById("card-pulled");
const cardPoints = document.getElementById("card-points");
const spinnerLoading = document.getElementById("spinner-block");
const deck = document.getElementById('deck');

/*** Variables ***/

let gameIsOver = false;
let cards = [];
let cardsCopy = [];
let pulledCardCount = -1;
let cardsRow = 0;

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
    if (cardsCopy.length > 0) {
        pulledCardCount ++;

        // get random card
        let randomIndexCard = getRandomInt(cardsCopy.length);
        let randomCard = cardsCopy[randomIndexCard];

        // new card
        let newCard = document.createElement("img");

        // new cards properties ...
        newCard.src = randomCard.images.svg;
        newCard.classList.add(randomCard.code);
        newCard.classList.add("defaultCardStyle ");

        // increase margin between each cards in each pull
        if (pulledCardCount > 0) {
            newCard.style.left = JSON.stringify(pulledCardCount * 15) + "px";
        }

        // create a second row for other cards
        if (pulledCardCount > 25) {
            cardsRow ++;
            newCard.style.top = "100px";
            newCard.style.left = JSON.stringify(cardsRow * 15) + "px";
        }

        // display card pulled in DOM
        cardPulled.innerHTML = getCardSymbol(randomCard);

        // remove card after pulling to avoid double
        cardsCopy.splice(randomIndexCard, 1);

        deck.appendChild(newCard);
    }
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
    startID.classList.add("d-none");
    spinnerLoading.classList.remove("d-none");

    // retrieve cards data
    deck.getCardsData()
        .then(data => {
            if (data.cards.length) {
                localStorage.setItem("cards", JSON.stringify(data.cards));
                mainID.classList.remove("hidden");
                spinnerLoading.classList.add("d-none");
            }
        })
        .catch(error => {
            throw new Error(error);
        });

    // set cards data
    cards = JSON.parse(localStorage.getItem('cards'));
    cardsCopy = JSON.parse(localStorage.getItem('cards'));
}

/**
 * Finish the game
 * - Enable or disable DOM elements
 */
function finish() {
    retryID.classList.remove("d-none");
}

/**
 * Retry the game
 * - Enable or disable DOM elements
 */
function retry() {
    retryID.classList.add("d-none");
}

/**
 * Get random number according to max range
 * @param {integer} max Maximal number
 * @returns Random number
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Get card with his symbol
 * - For example, card number "4" with suit "diamonds" will return 4♦️
 * @param {object} card Random card
 * @returns Card number with his symbol
 */
function getCardSymbol(card) {
    const values = ["KING", "JACK", "QUEEN", "AS"];

    switch (card.suit) {
        case "SPADES":
            if (values.includes(card.value)) {
                return `${card.code.split('')[0]} ♠️`;
            } else {
                return `${card.value.split('')[0]} ♠️`;
            }
        case "CLUBS":
            if (values.includes(card.value)) {
                return `${card.code.split('')[0]} ♣️`;
            } else {
                return `${card.value.split('')[0]} ♣️`;
            }
        case "HEARTS":
            if (values.includes(card.value)) {
                return `${card.code.split('')[0]} ♥️`;
            } else {
                return `${card.value.split('')[0]} ♥️`;
            }
        case "DIAMONDS":
            if (values.includes(card.value)) {
                return `${card.code.split('')[0]} ♦️`;
            } else {
                return `${card.value.split('')[0]} ♦️`;
            }
        default:
            throw new Error("Card suit not implemented");
    }
}