/**
 * Verify if user winning the game
 * @param {number} points Total points of user
 * @returns User winning or not
 */
function verifyUserWinning(points) {
    if (points > 21) {
        return true;
    } else {
        return false;
    }
}

export { verifyUserWinning };