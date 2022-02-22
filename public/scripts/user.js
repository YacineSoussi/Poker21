class User {
    constructor() {}

    /**
     * Verify if user winning the game
     * @param {number} points Total points of user
     * @returns Content according to if user winning or not
     */
    verifyUserWinning(points) {
        if (points > 21) {
            return "Tu as gagné, bravo !";
        } else {
            return "Tu as perdu, réessaie !";
        }
    }
}