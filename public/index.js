/*** DOM elements ***/

const startID = document.getElementById("start");
const retryID = document.getElementById("retry");
const pullID = document.getElementById("pull");
const finishID = document.getElementById("finish");
const mainID = document.getElementById("main");
const cardPulledID = document.getElementById("card-pulled");
const cardPointsID = document.getElementById("card-points");
const spinnerLoadingID = document.getElementById("spinner-block");
const deckID = document.getElementById("deck");
const missingCardsID = document.getElementById("missing-cards");

/*** Variables ***/

const deckInstance = new Deck();
const cardInstance = new Card();
let cards = [];
let cardsCopy = [];
let pulledCardCount = -1;
let cardsRow = 0;

/*** Events ***/

startID.addEventListener("click", function() {
    start();
});

retryID.addEventListener("click", function() {
    retry();
});

finishID.addEventListener("click", function() {
    finish();
});

pullID.addEventListener("click", function() {
    if (cardsCopy && cardsCopy.length > 0) {
        pulledCardCount ++;

        // get random card
        let randomIndexCard = getRandomInt(cardsCopy.length);
        let randomCard = cardsCopy[randomIndexCard];

        // new card
        let newCard = document.createElement("img");

        // new cards properties ...
        newCard.src = randomCard.images.svg;
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
        cardPulledID.innerHTML = cardInstance.getCardSymbol(randomCard);

        if (cardPointsID.value) {
            cardPointsID.value = Number(cardPointsID.value) + Number(cardInstance.getCardPoints(randomCard));
        } else {
            cardPointsID.value = cardInstance.getCardPoints(randomCard);
        }

        // update value attribute
        cardPointsID.setAttribute("value", cardPointsID.value);

        // display card points in DOM
        cardPointsID.innerHTML = cardPointsID.value;

        // remove card after pulling to avoid double
        cardsCopy.splice(randomIndexCard, 1);

        // update missing cards value
        missingCardsID.value = cardsCopy.length;
        missingCardsID.setAttribute("value", missingCardsID.value);
        missingCardsID.innerHTML = missingCardsID.value;

        deckID.appendChild(newCard);
    }
});

/*** Functions ***/

/**
 * Start the game
 * - Loading cards
 * - Enable or disable DOM elements
 */
function start() {
    // DOM elements manipulation
    startID.classList.add("d-none");
    spinnerLoadingID.classList.remove("d-none");

    // retrieve cards data
    deckInstance.getCardsData()
        .then(data => {
            if (data.cards.length) {
                localStorage.setItem("cards", JSON.stringify(data.cards));
                mainID.classList.remove("hidden");
                spinnerLoadingID.classList.add("d-none");
            }
        })
        .catch(error => {
            throw new Error(error);
        });

    // set cards data
    cards = JSON.parse(localStorage.getItem("cards"));
    cardsCopy = JSON.parse(localStorage.getItem("cards"));

    // init missing cards value
    missingCardsID.value = cardsCopy.length;
    missingCardsID.setAttribute("value", missingCardsID.value);
    missingCardsID.innerHTML = missingCardsID.value;
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
