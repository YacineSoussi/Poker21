class Deck {
    constructor() {}

    /**
     * Get new deck data
     * - { deck_id: null, remaining: null, shuffled: null, success: null }
     * @returns Promise of deck data object
     */
    getNewDeck() {
        return fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Response is not valid");
                }
            });
    }

    /**
     * Get deck
     * - { cards: null, deck_id: null, remaining: null, success: null }
     * @param {number} id Deck ID
     * @param {string} count Cards count
     * @param {AbortSignal} signal Abort signal instance
     * @returns Promise of deck data object
     */
    async getDeck(id, count, signal) {
        const url = `https://deckofcardsapi.com/api/deck/${id}/draw/?count=${count}`;
        const response = await fetch(url, { signal });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Response is not valid");
        }
    }

    /**
     * Shuffle the deck
     * - { cards: null, deck_id: null, remaining: null, success: null }
     * @param {number} id Deck ID
     * @returns Promise of deck data object
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
            .then(data => data);
    }
}