class Deck {
    constructor() {}

    /**
     * Get new deck data
     * - { deck_id: null, remaining: null, shuffled: null, success: null }
     * @returns Deck data object
     */
    getNewDeck() {
        return fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Response is not valid")
                }
            })
            .catch(error => {
                throw new Error(error);
            })
    }

    /**
     * Get deck
     * - { cards: null, deck_id: null, remaining: null, success: null }
     * @param {number} id Deck ID
     * @returns Deck data object
     */
    getDeck(id) {
        return fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Response is not valid")
                }
            })
            .then(data => data)
            .catch(error => {
                throw new Error(error);
            })
    }


    /**
     * Shuffle the deck
     * - { cards: null, deck_id: null, remaining: null, success: null }
     * @param {number} id Deck ID
     * @returns Deck data objects
     */
    shuffleDeck(id) {
        return fetch(`https://deckofcardsapi.com/api/deck/${id}/shuffle/`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Response is not valid")
                }
            })
            .then(data => data)
            .catch(error => {
                throw new Error(error);
            })
    }
}