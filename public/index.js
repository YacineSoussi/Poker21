/*** DOM elements ***/

const startID = document.getElementById("start");
const retryID = document.getElementById("retry");
const pullID = document.getElementById("pull");
const finishID = document.getElementById("finish");
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

// properties
let cardsConfig,
    cardsRow,
    currentCardPoints,
    nextCardPoints,
    pulledCardCount,
    currentCard,
    gameStarting,
    gameIsFinish;

/*** Functions ***/

/**
 * Start the game
 * - Loading cards
 * - Enable or disable DOM elements
 */
function start() {
    initVariables();
    startID.classList.add("d-none");
    spinnerLoadingID.classList.remove("d-none");
    deck.getNewDeck()
        .then(data => {
            if (data) {
                setCardConfig(data);
                gameStarting = true;
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
            pullCard(true);
        }
    }
}

/**
 * Retry the game
 * - Remove or display DOM elements
 * - Shuffle deck
 */
function retry() {
    resetElements();
    deck.shuffleDeck(cardsConfig.deck_id)
        .then(data => {
            if (data) {
                initVariables();
                setCardConfig(data);
                gameStarting = true;
            }
        })
        .catch(err => {
            throw new Error(err);
        });
}

/**
 * Pull a card from deck
 * @param {boolean} finish Force finish of the game
 */
function pullCard(finish = false) {
    if (gameStarting && Object.entries(cardsConfig).length > 0 && !gameIsFinish) {
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
        retryID.classList.remove("d-none");

        // display card pulled in DOM (symbol + value)
        currentCardID.innerHTML = card.getCardSymbol(currentCard);

        // update card points
        currentCardPoints = (currentCardPoints) ?
                                currentCardPoints + card.getCardPoints(currentCard) :
                                    card.getCardPoints(currentCard);

        card.setCardPoints(currentCardPoints, cardPointsID);
        card.updateMissingCards(cardsConfig.remaining, missingCardsID);
        createCardImage(currentCard, deckID);

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
}

/**
 * Set card config
 * @param {object} data Card config properties
 */
function setCardConfig(data) {
    cardsConfig = {...data};
    localStorage.setItem("cardsConfig", JSON.stringify(cardsConfig));
    mainID.classList.remove("hidden");
    spinnerLoadingID.classList.add("d-none");
    card.updateMissingCards(cardsConfig.remaining, missingCardsID);
}

/**
 * Init variables
 */
function initVariables() {
    cardsConfig = {};
    cardsRow = 0;
    currentCardPoints = 0;
    nextCardPoints = null;
    pulledCardCount = -1;
    currentCard = {};
    gameStarting = false;
    gameIsFinish = false;
}

/**
 * Reset elements
 * - Reset class of DOM elements
 * - Reset content of DOM elements
 * - Reset attributes of DOM elements
 */
function resetElements() {
    retryID.classList.add("d-none");
    finishID.classList.add("d-none");
    spinnerLoadingID.classList.remove("d-none");
    mainID.classList.add("hidden");
    pullID.classList.remove("d-none");
    deckID.innerHTML = '';
    currentCardID.innerHTML = 'Aucune carte tirée ...';
    cardPointsID.innerHTML = '0';
    cardPointsID.setAttribute("value", '0');
    missingCardsID.innerHTML = '';
}

/**
 * Create card image in DOM
 * - Initialize DOM element
 * - Set properties
 * - Append image
 * @param {object} card Current card
 * @param {Element} deck Deck DOM element
 */
function createCardImage(card, deck) {
    // new card and his properties
    let cardImage = document.createElement("img");
    cardImage.src = card.images.svg;
    cardImage.classList.add("defaultCardStyle ");

    // increase pulled card count
    pulledCardCount ++;

    // increase margin between each cards in each pull
    if (pulledCardCount > 0) {
        cardImage.style.left = JSON.stringify(pulledCardCount * 15) + "px";
    }

    // create a second row for other cards
    if (pulledCardCount > 25) {
        cardsRow ++;
        cardImage.style.top = "100px";
        cardImage.style.left = JSON.stringify(cardsRow * 15) + "px";
    }

    // append card element to DOM
    deck.appendChild(cardImage);
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
