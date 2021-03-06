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
                return `${card.code.split("")[0]} ♠️`;
            } else {
                if (card.value === "10") {
                    return `${card.value} ♠️`;
                } else {
                    return `${card.value.split("")[0]} ♠️`;
                }
            }
        case "CLUBS":
            if (values.includes(card.value)) {
                return `${card.code.split("")[0]} ♣️`;
            } else {
                if (card.value === "10") {
                    return `${card.value} ♣️`;
                } else {
                    return `${card.value.split("")[0]} ♣️`;
                }
            }
        case "HEARTS":
            if (values.includes(card.value)) {
                return `${card.code.split("")[0]} ♥️`;
            } else {
                if (card.value === "10") {
                    return `${card.value} ♥️`;
                } else {
                    return `${card.value.split("")[0]} ♥️`;
                }
            }
        case "DIAMONDS":
            if (values.includes(card.value)) {
                return `${card.code.split("")[0]} ♦️`;
            } else {
                if (card.value === "10") {
                    return `${card.value} ♦️`;
                } else {
                    return `${card.value.split("")[0]} ♦️`;
                }
            }
        default:
            throw new Error("Card suit not implemented");
    }
}

/**
 * Get card points according to random card pulled
 * @param {object} card Random card
 * @returns Card points
 */
function getCardPoints(card) {
    switch (card.value) {
        case "KING":
            return 10;
        case "JACK":
            return 10;
        case "QUEEN":
            return 10;
        case "ACE":
            return 0;
        default:
            return Number(card.value);
    }
}

/**
 * Update missing cards property data
 * @param {number} remaining Number of remaining cards
 * @param {Element} missing Missing DOM element
 */
function updateMissingCards(remaining, missing) {
    missing.value = remaining;
    missing.setAttribute("value", missing.value);
    missing.innerHTML = missing.value;
}

/**
 * Set card points data
 * - Set attribute value
 * - Display points in DOM
 * @param {number} cardPoints Current card points
 * @param {Element} card Card DOM element
 */
function setCardPoints(cardPoints, card) {
    // update value attribute
    card.setAttribute("value", cardPoints);

    // display card points in DOM
    card.innerHTML = cardPoints;
}

export { getCardSymbol, getCardPoints, updateMissingCards, setCardPoints };