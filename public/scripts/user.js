class User {
    constructor() {}

    /**
     * Verify if user winning the game
     * - According to some cases, return text is different
     * @param {number} previousCardPoints Previous card points
     * @param {number} currentCardPoints Current card points
     * @param {boolean} check Check mode enabled or not
     */
    verifyUserWinning(previousCardPoints, currentCardPoints, check = false) {
        if (previousCardPoints > 21) {
            if (check) {
                alert("Tu as déjà perdu, tu as plus de 21 points.");
            } else {
                alert(`La prochaine carte vaut : ${currentCardPoints} points. Tu as perdu, tu as plus de 21 points.`);
            }
        } else {
            if (previousCardPoints + currentCardPoints > 21) {
                if (check) {
                    alert(`La prochaine carte vaut : ${currentCardPoints} points. Si tu t'arrêtes maintenant, tu gagnes la partie.`);
                } else {
                    alert(`La prochaine carte vaut : ${currentCardPoints} points. Tu as gagné, ton score est supérieur à 21.`);
                }
            } else {
                if (previousCardPoints + currentCardPoints === 21) {
                    if (check) {
                        alert("Si tu t'arrêtes maintenant, tu gagnes la partie. Tu auras 21 points.");
                    } else {
                        alert(`La prochaine carte vaut : ${currentCardPoints} points. Tu as gagné, tu as 21 points.`);
                    }
                } else {
                    if (check) {
                        alert(`La prochaine carte vaut : ${currentCardPoints} points. Si tu t'arrêtes maintenant, tu perds la partie.`);
                    } else {
                        alert(`La prochaine carte vaut : ${currentCardPoints} points. Tu as perdu, ton score est inférieur à 21.`);
                    }
                }
            }
        }
    }
}