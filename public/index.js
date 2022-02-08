/*** DOM elements ***/

const startID = document.getElementById("start");
const retryID = document.getElementById("retry");
const pullID = document.getElementById("pull");
const finishID = document.getElementById("finish");
const checkID = document.getElementById("check");
const mainID = document.getElementById("main");
const currentCardID = document.getElementById("card-pulled");
const cardPointsID = document.getElementById("card-points");
const spinnerLoadingID = document.getElementById("spinner-block");
const deckID = document.getElementById("deck");
const missingCardsID = document.getElementById("missing-cards");

/*** Variables ***/

// instances
const deck = new Deck();
const card = new Card();
const user = new User();

// cards properties
let cardsConfig = {};
let cardsRow = 0;
let currentCardPoints = 0;
let nextCardPoints = null;
let pulledCardCount = -1;
let currentCard = {};
let previousCheckCard = {};

// other properties
let gameIsFinish = false;
let checkStateMode = false;

/*** Functions ***/

/**
 * Start the game
 * - Loading cards
 * - Enable or disable DOM elements
 */
 function start() {
    startID.classList.add("d-none");
    spinnerLoadingID.classList.remove("d-none");
    deck.getNewDeck()
        .then(data => {
            if (data) {
                cardsConfig = {...data};
                localStorage.setItem("cardsConfig", JSON.stringify(cardsConfig));
                mainID.classList.remove("hidden");
                spinnerLoadingID.classList.add("d-none");
                card.updateMissingCards(cardsConfig.remaining, missingCardsID);
            }
        })
        .catch(error => {
            throw new Error(error);
        });
}

/**
 * Finish the game
 * @param {boolean} finish Force finish of the game
 * - Force here is useful for main case like when card points of user is equal to 21
 */
function finish(finish = false) {
    if (!gameIsFinish) {
        if (finish) {
            finishGame();
            alert(`Tu as gagné, tu as 21 points.`);
        } else {
            if (!checkStateMode) {
                pullCard(true);
            } else {
                pullCard();
                user.verifyUserWinning(currentCardPoints - nextCardPoints, nextCardPoints, false);
                checkStateMode = false;
                finishGame();
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
 * Pull a card from deck
 * @param {boolean} finish Force finish of the game
 */
function pullCard(finish = false) {
    if (Object.entries(cardsConfig).length > 0 && !gameIsFinish) {
        if (!checkStateMode) {
            deck.getDeck(cardsConfig.deck_id)
                .then(data => {
                    if (data.cards?.length) {
                        currentCard = {...data.cards[0]};
                        cardsConfig.remaining = data.remaining;

                        addCard(currentCard);

                        if(cardsConfig.remaining === 0) {
                            finishGame();
                            user.verifyUserWinning(currentCardPoints, -1);
                        }

                        nextCardPoints = (currentCard) ? card.getCardPoints(currentCard) : 0;

                        if (finish) {
                            finishGame();
                            user.verifyUserWinning(currentCardPoints - nextCardPoints, nextCardPoints);
                        }
                    }
                })
                .catch(err => {
                    throw new Error(err);
                });
        } else {
            addCard(currentCard);
        }
    }
}

/**
 * Check if next card will be make user winning or losing
 */
function checkNextCardWinning() {
    if (!gameIsFinish && cardsConfig.remaining >= 0) {
        if (!checkStateMode) {
            deck.getDeck(cardsConfig.deck_id)
                .then(data => {
                    currentCard = {...data.cards[0]};
                    previousCheckCard = {...currentCard};
                    cardsConfig.remaining = data.remaining;
                    nextCardPoints = card.getCardPoints(currentCard);
                    user.verifyUserWinning(currentCardPoints, nextCardPoints, true);
                    checkStateMode = true;
                })
                .catch(err => {
                    throw new Error(err);
                })
        } else {
            nextCardPoints = card.getCardPoints(previousCheckCard);
            user.verifyUserWinning(currentCardPoints, nextCardPoints, true);
        }
    }
}

/**
 * Add a card
 * - Make all logic
 * - Add card to DOM
 * @param {object} currentCard Current card
 */
function addCard(currentCard) {
    if (!gameIsFinish && cardsConfig.remaining >= 0) {
        finishID.classList.remove("d-none");
        checkID.classList.remove("d-none");
        retryID.classList.remove("d-none");

        // display card pulled in DOM (symbol + value)
        currentCardID.innerHTML = card.getCardSymbol(currentCard);

        // update card points
        currentCardPoints = (currentCardPoints) ?
                                currentCardPoints + card.getCardPoints(currentCard) :
                                    card.getCardPoints(currentCard);

        card.setCardPoints(currentCardPoints, cardPointsID);
        card.updateMissingCards(cardsConfig.remaining, missingCardsID);
        card.createCardImage(currentCard, deckID);

        checkStateMode = false;

        // user have 21 points
        if (currentCardPoints === 21) {
            finish(true);
        }
    }
}

/**
 * Finish the game
 * - Disable elements in DOM
 */
function finishGame() {
    finishID.classList.add("d-none");
    pullID.classList.add("d-none");
    checkID.classList.add("d-none");
    gameIsFinish = true;
}

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
    checkNextCardWinning();
});
