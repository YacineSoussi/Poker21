/*** DOM loaded ****/

window.addEventListener("load", () => getNetworkStatus());

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
const pullCountID = document.getElementById("pullCount");
const pullProcessingID = document.getElementById("pullProcess");
const cancelPullID = document.getElementById("pullProcess");
const detailsID = document.getElementById("details");
const gameInformationID = document.getElementById("gameInformation");

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
    gameIsFinish,
    cancelPullProcess,
    pullInProcess,
    controller,
    signal,
    userWin,
    count;

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
            openModal("Tu as gagné, tu as 21 points !");
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
    gameIsFinish = true;
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
    if (gameStarting && Object.entries(cardsConfig).length > 0 && !gameIsFinish && !pullInProcess) {
        vibrateDevice();
        pullProcessingID.classList.remove("d-none");
        initializeAbortController();
        pullInProcess = true;

        deck.getDeck(cardsConfig.deck_id, count, signal)
            .then(data => {
                if (data.cards?.length) {
                    pullProcessingID.classList.add("d-none");
                    this.updateRemainingCards(data.remaining);
                    addCard(data.cards, count);

                    if (finish) {
                        const currentCard = {...data.cards[0]};
                        const nextCardPoints = (currentCard) ? card.getCardPoints(currentCard) : 0;
                        userWin = user.verifyUserWinning(currentCardPoints + nextCardPoints);

                        if (userWin) {
                            openModal("Tu as gagné, bravo !");
                        } else {
                            openModal("Tu as perdu, réessaie !");
                        }

                        finishGame();
                    }
                }
            })
            .catch(err => {
                if (!cancelPullProcess) {
                    alert("Une erreur est survenu lors du tirage des cartes !");
                    throw new Error(err);
                }
            });
    }
}

/**
 * Update remaining of cards
 * @param {number} remaining Cards remaining
 */
function updateRemainingCards(remaining) {
    cardsConfig.remaining = remaining;
    pullCountID.setAttribute("max", remaining);
}

/**
 * Add a card
 * - Make all logic
 * - Add cards to DOM
 * @param {object} cards Cards list
 * @param {number} count Cards count
 */
function addCard(cards, count) {
    if (!gameIsFinish) {
        finishID.classList.remove("d-none");
        retryID.classList.remove("d-none");
        pullCardID.classList.remove("d-none");

        if (count === 1) {
            addCardOperations(cards[0]);
        } else if (count > 1) {
            for (let index = 0; index < count; index++) {
                setTimeout(() => {
                    addCardOperations(cards[index]);
                }, 1000 + (1500 * index));
            }
        }
    }
}

/**
 * Make all operations of addCard main method
 * @param {array} cards Cards list
 */
function addCardOperations(cards) {
    if (!gameIsFinish) {
        // display card pulled in DOM (symbol + value)
        currentCardID.innerHTML = card.getCardSymbol((cards.length > 0) ? cards[index] : cards);

        // update card points
        currentCardPoints = (currentCardPoints) ?
                                currentCardPoints + card.getCardPoints((cards.length > 0) ? cards[index] : cards) :
                                    card.getCardPoints((cards.length > 0) ? cards[index] : cards);

        if (currentCardPoints > 21) {
            openModal("Tu as perdu, réessaie !");
            finishGame();
        }

        if (currentCardPoints === 21) {
            finish(true);
        }

        card.setCardPoints(currentCardPoints, cardPointsID);
        card.updateMissingCards(cardsConfig.remaining, missingCardsID);
        createCardImage((cards.length > 0) ? cards[index] : cards, deckID);

        pullInProcess = false;
    }
}

/**
 * Finish the game
 * - Disable elements in DOM
 */
function finishGame() {
    finishID.classList.add("d-none");
    pullCardID.classList.add("d-none");
    gameIsFinish = true;
}

/**
 * Make animation on cards after winning
 */
function makeAnimationAfterWinning() {
    document.querySelectorAll('.defaultCardStyle').forEach(node => node.classList.remove('lost'));
    document.querySelectorAll('.defaultCardStyle').forEach(node => node.classList.add('winning'));
}

/**
 * Make animation on cards after lost
 */
function makeAnimationAfterLost() {
    document.querySelectorAll('.defaultCardStyle').forEach(node => node.classList.remove('winning'));
    document.querySelectorAll('.defaultCardStyle').forEach(node => node.classList.add('lost'));
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
    cancelPullProcess = false;
    pullInProcess = false;
    count = 0;
    userWin = false;
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
    pullCardID.classList.remove("d-none");
    document.querySelectorAll('.defaultCardStyle').forEach(node => node.remove());
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
    cardImage.style.left = "50%";

    // increase pulled card count
    pulledCardCount ++;

    const negativeOrPositive = Math.ceil((Math.random() - 0.5) * 2) < 1 ? -1 : 1;

    // cards position
    if (pulledCardCount > 0) {
        let leftPosition = -50 + (count * negativeOrPositive);

        if (leftPosition < -130) { leftPosition = -130; }
        if (leftPosition > 0) { leftPosition = 0; }
        cardImage.style.transform = `translateX(${leftPosition}%) rotate(${getRandomRotatePosition()}deg)`;

        let topPosition = (pulledCardCount * 10) * negativeOrPositive;
        if (topPosition < -75) { topPosition = -75; }
        if (topPosition > 200) { topPosition = 200; }
        cardImage.style.top = `${topPosition}px`;

        (negativeOrPositive === 1) ? count += 10 : count -= 10;
    } else {
        cardImage.style.transform = `translateX(-50%) rotate(${getRandomRotatePosition()}deg)`;
        (negativeOrPositive === 1) ? count += 10 : count -= 10;
    }

    // append card element to DOM
    deck.appendChild(cardImage);
}

/**
 * Get navigator status
 * - Online ==> true
 * - Offline ==> false
 * @returns True or false
 */
function getNavigatorStatus() {
    return window.navigator.onLine;
}

/**
 * Get network status
 * - Change DOM according to network status
 */
function getNetworkStatus() {
    const statusDisplay = document.getElementById("status");

    statusDisplay.innerHTML = (`
        <p class="${(getNavigatorStatus()) ? "success" : "fail"} mr-2"</p>
        <p> ${statusDisplay.textContent = (getNavigatorStatus()) ? "Online" : "Offline"}</p>
    `);
}

/**
 * Initialize AbortController interface and signal object
 */
function initializeAbortController() {
    controller = new AbortController();
    signal = controller.signal;
}

/**
 * Open modal and display content inside
 * @param {string} content Content to display in modal
 */
function openModal(content) {
    vibrateDevice();
    detailsID.open = true;
    gameInformationID.innerHTML = content;

    if (userWin) {
        makeAnimationAfterWinning();
    } else {
        makeAnimationAfterLost();
    }
}

/**
 * Vibrate device
 */
function vibrateDevice() {
    const canVibrate = window.navigator.vibrate;

    if (canVibrate) {
        window.navigator.vibrate(1000);
    }
}

/**
 * Detect proximity in device
 */
function detectDeviceProximity() {
    window.addEventListener('deviceproximity', function(event) {
        alert('PROXIMITY');
        // console.log("value: " + event.value, "max: " + event.max, "min: " + event.min);
    });
}

/**
 * Abort pulling of a card in process
 */
function abortCardPulling() {
    pullProcessingID.classList.add("d-none");
    cancelPullProcess = true;
    controller.abort();
    pullInProcess = false;
}

/**
 * Get random rotate position
 * @returns Rotate position
 */
function getRandomRotatePosition() {
    return Math.random() * (360 - 0);
}

/*** Events ***/

/**
 * Event trigger to start the game
 */
startID.addEventListener("click", () => start());

/**
 * Event trigger to retry the game
 */
retryID.addEventListener("click", () => retry());

/**
 * Event trigger finish the game
 */
finishID.addEventListener("click", () => finish());

/**
 * Event trigger to pull one card
 */
pullID.addEventListener("click", () => getDeck(1));

/**
 * Event trigger to pull multiple cards
 */
pullsID.addEventListener("click", function() {
    const value = Number(pullCountID.value);
    const maxAttributeValue = Number(pullCountID.getAttribute("max"));

    if (value) {
        if (value < maxAttributeValue) {
            getDeck(value);
        } else {
            alert(`Tu ne peux pas tirer plus de ${maxAttributeValue} cartes !`);
        }

        pullCountID.value = 0;
    }
});

/**
 * Event trigger when user press a key
 * - Case of key "d" ==> pull a card
 * - Case of key "c" ==> abort pulling card in process
 */
document.addEventListener("keypress", function onEvent(event) {
    if (event.key.toLowerCase() === 'd') {
        getDeck(1);
    }

    if (event.key.toLowerCase() === 'c') {
        abortCardPulling();
    }
});

/**
 * Event trigger to abort http request during a card pulling
 */
cancelPullID.addEventListener("click", () => abortCardPulling());

/*** Others ***/

setInterval(() => getNetworkStatus(), 30000);