# Project Title

♠️♣️ POKER 21 ♥️♦️

## Tech Stack

**Client:** HTML5, CSS3, Native Javascript (VanillaJS)

## Requirement

- Docker

## Installation

```bash
  git clone https://github.com/Roulioo/Poker21.git
  cd Poker21
  npm install
```

## Running Tests

To run tests, run the following command

- MAC OS, LINUX

```bash
  make start (start)
  make stop (stop)
  make restart (down & start)
```

- WINDOWS

```bash
  docker compose up -d (start)
  docker compose down -d (down)
```

- After starting web server, go to http://localhost:8080

## Documentation

- Le jeu du 21 est un jeu de cartes consistant à se rapprocher le plus possible d’un score de 21 qui est obtenu en additionnant les scores de chaque carte qui sont tirées. Le joueur gagne s’il atteint 21, ou s’il décide de s’arrêter et que la carte suivante est supérieure à 21. Chaque carte vaut sa valeur en point, sauf pour l’As qui vaut 0 point, et le roi, la reine et le valet qui valent 10 points chacun.

## Features

- Chaque carte tirée doit être affichée à l’écran. ✅
- Il doit être possible d’afficher le nombre de cartes restantes, mis à jour après chaque tirage. ✅
- Il doit être possible d’afficher le score en cours, mis à jour après chaque tirage. ✅
- Il doit être possible d’afficher une fenêtre modale de résultat après une victoire ou un échec. ✅
- Il doit être possible d’annuler le tirage d’une carte en appuyant sur la touche “C” du clavier. ✅
- Il doit être possible d’annuler le tirage d’une carte en cours de requête. ✅
- Il doit être possible d’avoir un message d’erreur lorsqu’une erreur survient lors d’un tirage de carte. ✅
- Il doit être possible de décider de s’arrêter pour voir si la carte suivante nous fait gagner ou perdre. ✅
- Il doit être possible de jouer à la fois sur mobile, tablette ou ordinateur. ✅
- Il doit être possible de pouvoir rejouer une partie après une victoire ou un échec. ✅
- Il doit être possible de pouvoir tirer de nouveau une carte lorsqu’une erreur réseau survient. ✅
- Il doit être possible de recommencer une nouvelle partie pendant une partie en cours. ✅
- Il doit être possible de reprendre une partie à tout moment, même après avoir fermé l’onglet. ✅
- Il doit être possible de tirer un nombre de cartes arbitraire à la fois. ✅
- Il doit être possible de tirer une carte en appuyant sur la touche “D” du clavier. ✅
- Il doit être possible de voir l’état courant du réseau (connecté, déconnecté). ✅
- Il doit être possible de voir un titre correctement affiché dans l’onglet du navigateur. ✅
- Il doit être possible de voir une icône affichée dans l’onglet du navigateur. ✅
- Il doit y avoir des animations affichées lorsqu’une carte est tirée et posée sur le tas. ✅
- Il doit y avoir un retour haptique (vibreur) lorsqu’une carte est tirée, lors d’une victoire ou d’un échec. (ANDROID seulement) ✅
- Il doit y avoir une animation des cartes lorsque le joueur gagne une partie. ✅
- Il doit y avoir une animation des cartes lorsque le joueur perd une partie. ✅
- Il doit y avoir une interface graphique pensée pour l’UX/UI et agréable à utiliser. ✅
- Il ne doit pas être possible de pouvoir recommencer avant d’avoir tiré au moins une carte. ✅
- Il ne doit pas être possible de s’arrêter de tirer une carte si aucune carte n’est en cours de tirage. ✅
- Il ne doit pas être possible de tirer une carte après que le jeu de carte soit vide. ✅
- Il ne doit pas être possible de tirer une carte après une victoire. ✅
- Il ne doit pas être possible de tirer une nouvelle carte si une carte est déjà en cours de tirage. ✅
- Le jeu de 52 cartes doit être construit en utilisant l’API https://deckofcardsapi.com. ✅
- Le jeu de 52 cartes ne doit contenir aucun joker. ✅
- Les cartes doivent être affichées les unes sur les autres de manière à imiter un paquet désordonné. ✅
- Les cartes tirées doivent être tirées depuis le même jeu de 52 cartes à chaque fois. ✅
- Une partie doit se dérouler avec le même jeu de 52 cartes. ✅
## Prerequisite

- Le projet a une documentation pour les testeurs. ✅
- Le projet doit être organisé en dossiers (styles, images, scripts, ...). Le projet doit être servi sur un serveur Web. ✅
- Le projet n’utilise aucune fonctionnalité dépréciée. ✅
- Le projet ne doit avoir aucune dépendance autre que Docker. ✅
- Le projet ne doit utiliser aucune librairie HTML, CSS ou JavaScript. ✅
- Le projet utilise des modules ECMAScript. ✅
- Toutes les erreurs doivent être gérées. ✅
## Authors

- [Júlio Pereira](https://github.com/Roulioo)
- [Ali Raid](https://github.com/alilou-dev)
- [Yacine Soussi](https://github.com/YacineSoussi)

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
