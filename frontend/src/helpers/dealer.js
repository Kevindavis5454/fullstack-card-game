import Card from './card';

export default class Dealer {
  constructor(scene) {
    this.dealCards = (deckId, playerAPile, playerBPile) => {
      let playerCard = new Card(scene);
      if (scene.isPlayerA) {
        playerCard.render(1170, 645, 'cardBack').setTint();
      } else {
        playerCard.render(1170, 645, 'cardBack');
      }

      let opponentCard = new Card(scene);
      if (scene.isPlayerA) {
        scene.opponentCards.push(opponentCard.render(1170, 127, 'cardBack').setTint().disableInteractive());
      } else {
        scene.opponentCards.push(opponentCard.render(1170, 127, 'cardBack').setTint().disableInteractive());
      }
    }
  }
}