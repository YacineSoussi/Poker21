import * as Type from "./type.js";

/**
 * {
 *   "success": boolean,
 *   "deck_id": string,
 *   "shuffled": boolean,
 *   "remaining": number
 * }
 */
const getNewDeckIsValid = Type.object([
    Type.property("success", Type.boolean),
    Type.property("deck_id", Type.string),
    Type.property("shuffled", Type.boolean),
    Type.property("remaining", Type.number)
]);

/**
 * {
 *   cards: [{ "image": string, "value": string, "suit": string, "code": string }],
 *   deck_id: string,
 *   remaining: number,
 *   success: boolean
 * }
 */
const getDeckIsValid = Type.object([
    Type.property("success", Type.boolean),
    Type.property("deck_id", Type.string),
    Type.property("cards", Type.array(Type.object([
        Type.property("image", Type.string),
        Type.property("value", Type.string),
        Type.property("suit", Type.string),
        Type.property("code", Type.string)
    ]))),
    Type.property("remaining", Type.number)
]);

/**
 * {
 *   "success": boolean,
 *   "deck_id": string,
 *   "shuffled": boolean,
 *   "remaining": number
 * }
 */
const shuffleDeckIsValid = Type.object([
    Type.property("success", Type.boolean),
    Type.property("deck_id", Type.string),
    Type.property("shuffled", Type.boolean),
    Type.property("remaining", Type.number)
]);

/**
 * Get new deck data
 * - { deck_id: null, remaining: null, shuffled: null, success: null }
 * @returns Promise of deck data object
 */
function getNewDeck() {
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
async function getDeck(id, count, signal) {
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
function shuffleDeck(id) {
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

export { getNewDeck, getDeck, shuffleDeck, getNewDeckIsValid, getDeckIsValid, shuffleDeckIsValid };