class Card {
    constructor() {}

    /**
     * Get card with his symbol
     * - For example, card number "4" with suit "diamonds" will return 4♦️
     * @param {object} card Random card
     * @returns Card number with his symbol
     */
    getCardSymbol(card) {
        const values = ["KING", "JACK", "QUEEN", "AS"];

        switch (card.suit) {
            case "SPADES":
                if (values.includes(card.value)) {
                    return `${card.code.split('')[0]} ♠️`;
                } else {
                    if (card.value === "10") {
                        return `${card.value} ♠️`;
                    } else {
                        return `${card.value.split('')[0]} ♠️`;
                    }
                }
            case "CLUBS":
                if (values.includes(card.value)) {
                    return `${card.code.split('')[0]} ♣️`;
                } else {
                    if (card.value === "10") {
                        return `${card.value} ♣️`;
                    } else {
                        return `${card.value.split('')[0]} ♣️`;
                    }
                }
            case "HEARTS":
                if (values.includes(card.value)) {
                    return `${card.code.split('')[0]} ♥️`;
                } else {
                    if (card.value === "10") {
                        return `${card.value} ♥️`;
                    } else {
                        return `${card.value.split('')[0]} ♥️`;
                    }
                }
            case "DIAMONDS":
                if (values.includes(card.value)) {
                    return `${card.code.split('')[0]} ♦️`;
                } else {
                    if (card.value === "10") {
                        return `${card.value} ♦️`;
                    } else {
                        return `${card.value.split('')[0]} ♦️`;
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
    getCardPoints(card) {
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
                return card.value;
        }
    }
}