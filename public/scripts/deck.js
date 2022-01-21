class Deck {
    constructor() {
        this.cards = [];
    }

    /**
     * Get cards data
     * - { cards, deck_id, remaining, success }
     * @returns Cards properties
     */
    async getCardsData() {
        let result;

        await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error during get deck object")
                }
            })
            .then(data => {
                result = fetch(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)
                            .then(response => {
                                if(response.ok) {
                                    return response.json();
                                } else {
                                    throw new Error("Error during get deck data")
                                }
                            })
                            .catch(error => {
                                throw new Error(error);
                            });
            })
            .catch(error => {
                throw new Error(error);
            })

        return result;
    }

    /**
     * Get cards
     * @returns Cards array
     */
    getCards() {
        return this.cards;
    }

    /**
     * Set cards
     * @param {array} cards Cards array
     */
    setCards(cards) {
        this.cards = cards;
    }
}