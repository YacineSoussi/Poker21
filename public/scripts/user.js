class User {
    constructor() {}

    /**
     * Verify if user winning the game
     * @param {number} points Total points of user
     */
    verifyUserWinning(points) {
        if (points > 21) {
            alert("Tu as gagné, bravo !");
        } else {
            alert("Tu as perdu, réessaie !");
        }
    }
}