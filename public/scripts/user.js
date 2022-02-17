class User {
    constructor() {}

    /**
     * Verify if user winning the game
     * - According to some cases, return text is different
     * @param {number} previousCardPoints Previous card points
     * @param {number} currentCardPoints Current card points
     */
    verifyUserWinning(previousCardPoints, currentCardPoints) {
        if (previousCardPoints > 21) {
            if (currentCardPoints === -1) {
                alert("Tu as déjà perdu, tu as plus de 21 points.");
            } else {
                alert(`La prochaine carte vaut : ${currentCardPoints} points. Tu as perdu, tu as plus de 21 points.`);
            }
        } else {
            if (previousCardPoints + currentCardPoints > 21) {
                alert(`La prochaine carte vaut : ${currentCardPoints} points. Tu as gagné, ton score est supérieur à 21.`);
            } else {
                if (previousCardPoints + currentCardPoints === 21) {
                    alert(`La prochaine carte vaut : ${currentCardPoints} points. Tu as gagné, tu as 21 points.`);
                } else {
                    alert(`La prochaine carte vaut : ${currentCardPoints} points. Tu as perdu, ton score est inférieur à 21.`);
                }
            }
        }
    }
}