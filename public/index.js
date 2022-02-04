/*** DOM elements ***/

const startID = document.getElementById("start");
const retryID = document.getElementById("retry");
const pullID = document.getElementById("pull");
const finishID = document.getElementById("finish");
const checkID = document.getElementById("check");
const mainID = document.getElementById("main");
const cardPulledID = document.getElementById("card-pulled");
const cardPointsID = document.getElementById("card-points");
const spinnerLoadingID = document.getElementById("spinner-block");
const deckID = document.getElementById("deck");
const missingCardsID = document.getElementById("missing-cards");

/*** Variables ***/

// instances
const deckInstance = new Deck();
const cardInstance = new Card();

// cards properties
let cards = [];
let cardsRow = 0;
let cardSymbol = null;
let cardPointsValue = 0;
let cardPoints = null;
let pulledCardCount = -1;
let randomIndexCard = null;
let randomCard = null;

// other properties
let gameIsFinish = false;
let checkStateMode = false;

/*** Events ***/

/**
 * Event trigger to start the game
 */
startID.addEventListener("click", function() {
    start();
});

/**
 * Event trigger to retry the game
 */
retryID.addEventListener("click", function() {
    retry();
});

/**
 * Event trigger finish the game
 */
finishID.addEventListener("click", function() {
    finish();
});

/**
 * Event trigger to pull a card
 */
pullID.addEventListener("click", function() {
    pullCard();
});

/**
 * Event trigger when user press letter "d" in keyboard
 */
document.addEventListener("keypress", function onEvent(event) {
    if (event.key.toLowerCase() === 'd') {
        pullCard();
    }
});

/**
 * Event trigger to check if next card will be make user winning or losing
 */
checkID.addEventListener("click", function() {
    check();
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

    // init missing cards value
    missingCardsID.value = cards.length;
    missingCardsID.setAttribute("value", missingCardsID.value);
    missingCardsID.innerHTML = missingCardsID.value;
}

/**
 * Finish the game
 * @param {*} forceFinish Force finish of game
 * - Force here is useful for main case like when card points of user is equal to 21
 */
function finish(forceFinish = false) {
    if (!gameIsFinish) {
        gameIsFinish = true;
        retryID.classList.remove("d-none");

        if (forceFinish) {
            alert(`Tu as gagné, tu as 21 points.`);
        } else {
            if (cardPointsValue > 21) {
                alert(`Tu as perdu, tu as plus de 21 points.`);
            } else {
                const randomCard = (checkStateMode) ? null : getRandomCard(cards);
                const nextCard = (checkStateMode) ? Number(cardPoints) : Number(cardInstance.getCardPoints(randomCard));
                const sumCards = cardPointsValue + Number(nextCard);

                if (sumCards > 21) {
                    alert(`Tu as gagné, la carte suivante vaut ${nextCard} points. Ton score est supérieur à 21.`);
                } else {
                    if (sumCards === 21) {
                        alert(`Tu as gagné, la carte suivante vaut ${nextCard} points. Tu as 21 points.`);
                    } else {
                        alert(`Tu as perdu, la carte suivante vaut ${nextCard} points. Ton score est inférieur à 21.`);
                    }
                }
            }
        }
    }
}

/**
 * Retry the game
 */
function retry() {
    retryID.classList.add("d-none");
    finishID.classList.add("d-none");
    location.reload(); // TODO search another way to reload everything without reload if possible
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
 * Get random card
 * @param {array} cards All cards
 * @returns Random card
 */
function getRandomCard(cards) {
    return cards[getRandomInt(cards.length)];
}

/**
 * Pull a card from deck
 */
function pullCard() {
    if (!gameIsFinish && cards && cards.length > 0) {
        // at least one card is pulled
        finishID.classList.remove("d-none");
        checkID.classList.remove("d-none");

        // increase pulled card count
        pulledCardCount ++;

        // get random card
        if (!checkStateMode) {
            randomIndexCard = getRandomInt(cards.length);
            randomCard = cards[randomIndexCard];
        }

        // new card and his properties
        let cardImage = document.createElement("img");
        cardImage.src = randomCard.images.svg;
        cardImage.classList.add("defaultCardStyle ");

        // increase margin between each cards in each pull
        if (pulledCardCount > 0) { cardImage.style.left = JSON.stringify(pulledCardCount * 15) + "px"; }

        // create a second row for other cards
        if (pulledCardCount > 25) {
            cardsRow ++;
            cardImage.style.top = "100px";
            cardImage.style.left = JSON.stringify(cardsRow * 15) + "px";
        }

        // display card pulled in DOM (symbol + value)
        if (!checkStateMode) {
            cardSymbol = cardInstance.getCardSymbol(randomCard);
            cardPulledID.innerHTML = cardSymbol;
        }

        // set card points value
        cardPointsValue = (checkStateMode) ?
                                Number(cardPointsValue) + Number(cardPoints) :
                                    (cardPointsValue) ?
                                        Number(cardPointsValue) + Number(cardInstance.getCardPoints(randomCard)) :
                                            Number(cardInstance.getCardPoints(randomCard));

        // update value attribute
        cardPointsID.setAttribute("value", cardPointsValue);

        // display card points in DOM
        cardPointsID.innerHTML = cardPointsValue;

        // remove card after pulling to avoid double
        cards.splice(randomIndexCard, 1);

        // update missing cards value
        missingCardsID.value = cards.length;
        missingCardsID.setAttribute("value", missingCardsID.value);
        missingCardsID.innerHTML = missingCardsID.value;

        // append card element to DOM
        deckID.appendChild(cardImage);

        // user have 21 points
        if (cardPointsValue === 21) { finish(true); }

        checkStateMode = false;
    }
}

/**
 * Check if next card will be make user winning or losing
 */
function check() {
    if (!gameIsFinish && cards.length) {
        // get random card
        if (!checkStateMode) { // avoid random card each time, wait for changing state
            randomIndexCard = getRandomInt(cards.length);
            randomCard = cards[randomIndexCard];
        }

        // check state active
        checkStateMode = true;

        // update card values
        cardPoints = cardInstance.getCardPoints(randomCard);
        cardSymbol = cardInstance.getCardSymbol(randomCard);

        // verify winning of user
        if (cardPointsValue > 21) {
            alert(`Tu as perdu, tu as plus de 21 points.`);
        } else {
            if (Number(cardPointsValue) + Number(cardPoints) > 21) {
                alert(`Si tu t'arrêtes maintenant, tu gagnes la partie. La prochaine carte vaut ${cardPoints} points.`);
            } else {
                if (Number(cardPointsValue) + Number(cardPoints) === 21) {
                    alert(`Si tu t'arrêtes maintenant, tu gagnes la partie. Tu auras 21 points.`);
                } else {
                    alert(`Si tu t'arrêtes maintenant, tu perds la partie. La prochaine carte vaut ${cardPoints} points.`);
                }
            }
        }
    }
}