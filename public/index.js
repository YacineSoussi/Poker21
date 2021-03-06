import { getNewDeck, getDeck, shuffleDeck, getNewDeckIsValid, getDeckIsValid, shuffleDeckIsValid } from './modules/deck.js';
import { verifyUserWinning } from './modules/user.js';
import { getCardSymbol, getCardPoints, updateMissingCards, setCardPoints } from './modules/card.js';

/*** Variables ***/

const toaster = new Toaster();

let startID,
    previousStartID,
    retryID,
    finishID,
    pullID,
    cardPointsID,
    currentCardID,
    containerID,
    deckID,
    detailInformationID,
    detailsID,
    gameInformationID,
    homeGameID,
    homePageID,
    mainID,
    missingCardsID,
    pullCardID,
    pullCountID,
    pullProcessingID,
    spinnerLoadingID,
    pullsID,
    cancelPullID,
    cardsConfig,
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
 * Init variables
 */
function initVariables() {
    const cardsPoints = JSON.parse(localStorage.getItem('cardsPoints'));
    cardsConfig = {};
    currentCardPoints = (cardsPoints?.currentCardPoints) ? cardsPoints.currentCardPoints : 0;
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
    containerID.classList.add('d-none');
    mainID.classList.add("hidden");
    pullCardID.classList.remove("d-none");
    document.querySelectorAll('.defaultCardStyle').forEach(node => node.remove());
    currentCardID.innerHTML = 'Aucune carte tirée ...';
    cardPointsID.innerHTML = '0';
    cardPointsID.setAttribute("value", '0');
    missingCardsID.innerHTML = '';
    localStorage.removeItem("cardsPoints");
    localStorage.removeItem("mainDOM");
}

/**
 * Start the game
 * - Loading cards
 * - Enable or disable DOM elements
 */
function start() {
    const mainCopy = JSON.parse(localStorage.getItem('mainDOM'));
    initVariables();

    if (localStorage.getItem('cardsConfig')) { // game already exist
        previousStartID.classList.add("d-none");
        spinnerLoadingID.classList.remove("hidden");
        mainID.classList.remove("hidden");
        setCardConfig(JSON.parse(localStorage.getItem('cardsConfig')));

        // keep previous DOM content
        if (mainCopy) {
            mainID.innerHTML = mainCopy;
            setDOMElements();
            setAllEventsListener();
        }

        gameStarting = true;
    } else { // new game
        startID.classList.add("d-none");
        spinnerLoadingID.classList.remove("hidden");

        getNewDeck().then(data => {
            if (data) {
                if (!getNewDeckIsValid(data)) {
                    return Promise.reject(new Error("Malformed data"));
                }

                mainID.classList.remove("hidden");
                setCardConfig(data);
                gameStarting = true;
            } else {
                displayToaster('warning', 'Information', 'Aucune données disponibles.');
            }
        }).catch(error => {
            displayToaster("danger", "Erreur", "Une erreur est survenu lors du tirage des cartes.");
            throw new Error(error);
        });
    }

    homePageID.classList.add('d-none');
    homeGameID.classList.remove('d-none');
}

/**
 * Display toaster
 * @param {string} style Toaster style
 * @param {string} title Toaster title
 * @param {string} content Toaster content
 */
function displayToaster(style, title, content) {
    toaster.render({
        style,
        title,
        content
    });
}

/**
 * Finish the game
 * @param {boolean} finish Force finish of the game
 * - PS: force here is useful for main case like when card points of user is equal to 21
 */
function finish(finish = false) {
    if (!gameIsFinish) {
        if (finish) {
            finishGame();
            openModal("Détails" , "Tu as gagné, tu as 21 points.");
        } else {
            setDeckData(1, true);
        }
    }
}

/**
 * Retry the game
 * - Remove or display DOM elements
 * - Shuffle deck
 */
function retry() {
    shuffleDeck(cardsConfig.deck_id).then(data => {
        resetElements();
        if (data) {
            if (!shuffleDeckIsValid(data)) {
                return Promise.reject(new Error("Malformed data"));
            }

            initVariables();
            setCardConfig(data);
            gameStarting = true;
        } else {
            displayToaster('warning', 'Information', 'Aucune données disponibles.');
        }
    }).catch(error => {
        displayToaster("danger", "Erreur", "Une erreur est survenu lors du tirage des cartes.")
        throw new Error(error);
    });
}

/**
 * Start process
 */
function startProcess() {
    pullProcessingID.classList.remove("d-none");
    initializeAbortController();
    pullInProcess = true;
}

/**
 * Get deck data
 * @param {number} count Cards count
 * @param {boolean} finish Force finish of the game
 */
function getDeckData(count, finish) {
    getDeck(cardsConfig.deck_id, count, signal).then(data => {
        if (!getDeckIsValid(data)) {
            return Promise.reject(new Error("Malformed data"));
        }

        if (data) {
            pullProcessingID.classList.add("d-none");
            updateRemainingCards(data.remaining);
            addCard(data.cards, count);

            // update local storage in each pull
            localStorage.setItem('cardsConfig', JSON.stringify({
                success: data.success,
                deck_id: data.deck_id,
                remaining: data.remaining
            }));

            if (finish) {
                const currentCard = {...data.cards[0]};
                const nextCardPoints = (currentCard) ? getCardPoints(currentCard) : 0;
                userWin = verifyUserWinning(currentCardPoints + nextCardPoints);

                if (userWin) {
                    openModal("Partie terminée" , "Tu as gagné, bravo.");
                } else {
                    clearStorage();
                    openModal("Partie terminée", "Tu as perdu, réessaie.");
                }

                finishGame();
            }
        } else {
            displayToaster('warning', 'Information', 'Aucune données disponibles.');
        }
    }).catch(error => {
        if (!cancelPullProcess) {
            displayToaster("danger", "Erreur", "Une erreur est survenu lors du tirage des cartes.")
        }
        throw new Error(error);
    });
}

/**
 * Set deck data
 * @param {number} count Cards count
 * @param {boolean} finish Force finish of the game
 */
function setDeckData(count, finish = false) {
    if (gameStarting && Object.entries(cardsConfig).length > 0 && !gameIsFinish && !pullInProcess) {
        vibrateDevice();
        startProcess();
        getDeckData(count, finish);
    }
}

/**
 * Initialize AbortController interface and signal object
 */
function initializeAbortController() {
    controller = new AbortController();
    signal = controller.signal;
}

/**
 * Update cards remaining
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
                setTimeout(() => addCardOperations(cards[index]), 1000 + (1500 * index));
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
        currentCardID.innerHTML = getCardSymbol(cards);

        // update card points
        currentCardPoints = (currentCardPoints) ?
                                currentCardPoints + getCardPoints(cards) : getCardPoints(cards);

        if (currentCardPoints > 21) {
            finishGame();
            clearStorage();
            openModal("Partie terminée", "Tu as perdu, réessaie.");
        }

        if (currentCardPoints === 21) {
            finish(true);
        }

        setCardPoints(currentCardPoints, cardPointsID);
        updateMissingCards(cardsConfig.remaining, missingCardsID);
        createCardImage(cards, deckID);
        pullInProcess = false;
    }
}

/**
 * Clear storage after lost game
 */
function clearStorage() {
    localStorage.removeItem('mainDOM');
    localStorage.removeItem('cardsConfig');
    localStorage.removeItem('cardsPoints');
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
    spinnerLoadingID.classList.add("hidden");
    updateMissingCards(cardsConfig.remaining, missingCardsID);
    updateRemainingCards(cardsConfig.remaining);
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

    // storage card points to keep last time
    localStorage.setItem('cardsPoints', JSON.stringify({currentCardPoints}));

    // store main content
    localStorage.setItem('mainDOM', JSON.stringify(document.getElementById("main").innerHTML));
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
 * Open modal and display content inside
 * @param {string} description Title of description
 * @param {string} content Content to display in modal
 */
function openModal(description, content) {
    containerID.classList.remove('d-none');
    vibrateDevice();
    detailsID.open = true;
    detailInformationID.innerHTML = description;
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


/**
 * Set pulls DOM element processing
 */
function setPullsDOMProcess() {
    const value = Number(pullCountID.value);
    const maxAttributeValue = Number(pullCountID.getAttribute("max"));

    if (value) {
        if (value < maxAttributeValue) {
            setDeckData(value);
        } else {
            displayToaster('info', 'Information', `Tu ne peux pas tirer plus de ${maxAttributeValue} cartes.`);
        }

        pullCountID.value = 0;
    }
}

/**
 * Set all DOM elements of application
 */
function setDOMElements() {
    cardPointsID = document.getElementById("card-points");
    currentCardID = document.getElementById("card-pulled");
    deckID = document.getElementById("deck");
    detailInformationID = document.getElementById("detailInformation");
    detailsID = document.getElementById("details");
    gameInformationID = document.getElementById("gameInformation");
    homeGameID = document.getElementById("homeGame");
    homePageID = document.getElementById("homePage");
    mainID = document.getElementById("main");
    missingCardsID = document.getElementById("missing-cards");
    pullCardID = document.getElementById("pullCard");
    pullCountID = document.getElementById("pullCount");
    pullProcessingID = document.getElementById("pullProcess");
    spinnerLoadingID = document.getElementById("spinner-block");
}

/*** Events ***/

/**
 * Set all events listener of cards block manipulation
 */
function setAllEventsListener() {
    startID = document.getElementById("start");
    previousStartID = document.getElementById("previousStart");
    retryID = document.getElementById("retry");
    finishID = document.getElementById("finish");
    pullID = document.getElementById("pull");
    pullsID = document.getElementById("pulls");
    cancelPullID = document.getElementById("pullProcess");
    containerID = document.getElementById("container");

    /**
     * Event trigger to start the game
     */
    startID.addEventListener("click", () => start());

    /**
     * Event trigger to get previous game
     */
    previousStartID.addEventListener("click", () => start());

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
    pullID.addEventListener("click", () =>setDeckData(1));

    /**
     * Event trigger to pull multiple cards
     */
    pullsID.addEventListener("click", () => setPullsDOMProcess());

    /**
     * Event trigger to abort http request during a card pulling
     */
    cancelPullID.addEventListener("click", () => abortCardPulling());
}

/**
 * Event trigger when user press a key
 * - Case of key "d" ==> pull a card
 * - Case of key "c" ==> abort pulling card in process
 */
document.addEventListener("keypress", function onEvent(event) {
    if (event.key.toLowerCase() === 'd') {
        setDeckData(1);
    }

    if (event.key.toLowerCase() === 'c') {
        abortCardPulling();
    }
});

/**
 * Event trigger when DOM loaded
 */
window.addEventListener("load", () => {
    setDOMElements();
    setAllEventsListener();
    getNetworkStatus();

    if (localStorage.getItem('cardsConfig')) {
        previousStartID.classList.remove("d-none");
    } else {
        startID.classList.remove("d-none");
    }
});

/*** Others ***/

setInterval(() => getNetworkStatus(), 30000);