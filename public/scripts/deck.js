class Deck {
    constructor() {}

    /**
     * Get deck data
     * - { deck_id: null, remaining: null, shuffled: null, success: null }
     * @returns Deck data object
     */
    getDeckData() {
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

}