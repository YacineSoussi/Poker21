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
const pullsID = document.getElementById("pulls");
const pullCardID = document.getElementById("pullCard");
const pullCount = document.getElementById("pullCount");

/*** Variables ***/

// instances
const deck = new Deck();
const card = new Card();
const user = new User();

// properties
let cardsConfig,
    currentCardPoints,
    pulledCardCount,
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
            getDeck(1, true);
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
 * Get deck
 * @param {number} count Cards count
 * @param {boolean} finish Force finish of the game
 */
function getDeck(count, finish = false) {
    if (gameStarting && Object.entries(cardsConfig).length > 0 && !gameIsFinish) {
        deck.getDeck(cardsConfig.deck_id, count)
            .then(data => {
                if (data.cards?.length) {
                    this.updateRemainingCards(data.remaining);
                    addCard(data.cards, count, (finish) ? true : false);

                    if (finish) {
                        const currentCard = {...data.cards[0]};
                        const nextCardPoints = (currentCard) ? card.getCardPoints(currentCard) : 0;
                        finishGame();
                        user.verifyUserWinning(currentCardPoints + nextCardPoints);
                    }
                }
            })
            .catch(err => {
                alert("Une erreur est survenu lors du tirage des cartes !");
                throw new Error(err);
            });
    }
}

/**
 * Update remaining of cards
 * @param {number} remaining Cards remaining
 */
function updateRemainingCards(remaining) {
    cardsConfig.remaining = remaining;
    pullCount.setAttribute("max", remaining);
}

/**
 * Add a card
 * - Make all logic
 * - Add cards to DOM
 * @param {object} cards Cards list
 * @param {number} count Cards count
 * @param {boolean} finish Force finish of the game
 */
function addCard(cards, count, finish = false) {
    if (!gameIsFinish) {
        finishID.classList.remove("d-none");
        retryID.classList.remove("d-none");
        pullCardID.classList.remove("d-none");

        if (count === 1) {
            addCardOperations(cards[0], finish);
        } else if (count > 1) {
            for (let index = 0; index < count; index++) {
                setTimeout(() => {
                    addCardOperations(cards[index], true);
                }, 1000 + (1500 * index));
            }

            if (currentCardPoints > 21) {
                alert("Tu as perdu, réessaie !");
                finishGame();
            }
        }
    }
}

/**
 * Make all operations of addCard main method
 * @param {array} cards Cards list
 * @param {boolean} finish Force finish of the game
 */
function addCardOperations(cards, finish = false) {
    // display card pulled in DOM (symbol + value)
    currentCardID.innerHTML = card.getCardSymbol((cards.length > 0) ? cards[index] : cards);

    // update card points
    currentCardPoints = (currentCardPoints) ?
                            currentCardPoints + card.getCardPoints((cards.length > 0) ? cards[index] : cards) :
                                card.getCardPoints((cards.length > 0) ? cards[index] : cards);

    if (currentCardPoints > 21 && !finish) {
        alert("Tu as perdu, réessaie !");
        finishGame();
    }

    if (currentCardPoints === 21) finish(true);

    card.setCardPoints(currentCardPoints, cardPointsID);
    card.updateMissingCards(cardsConfig.remaining, missingCardsID);
    createCardImage((cards.length > 0) ? cards[index] : cards, deckID);
}

/**
 * Finish the game
 * - Disable elements in DOM
 */
function finishGame() {
    finishID.classList.add("d-none");
    pullID.classList.add("d-none");
    pullCardID.classList.add("d-none");
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
    currentCardPoints = 0;
    pulledCardCount = -1;
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
    pullCardID.classList.remove("d-none");
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
    cardImage.classList.add("defaultCardStyle");

    // increase pulled card count
    pulledCardCount ++;

    // increase margin between each cards in each pull
    if (pulledCardCount > 0) {
        cardImage.style.left = JSON.stringify(pulledCardCount * 15) + "px";
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
 * Event trigger to pull one card
 */
pullID.addEventListener("click", function() {
    getDeck(1);
});

/**
 * Event trigger to pull multiple cards
 */
pullsID.addEventListener("click", function() {
    const value = Number(document.getElementById("pullCount").value);
    const maxAttributeValue = Number(pullCount.getAttribute("max"));

    if (value) {
        if (value < maxAttributeValue) {
            getDeck(value);
        } else {
            alert(`Tu ne peux pas tirer plus de ${maxAttributeValue} cartes !`);
        }

        pullCount.value = 0;
    }
});

/**
 * Event trigger when user press letter "d" in keyboard
 */
document.addEventListener("keypress", function onEvent(event) {
    if (event.key.toLowerCase() === 'd') {
        getDeck(1);
    }
});