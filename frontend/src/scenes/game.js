import Card from '../helpers/card';
import Zone from '../helpers/zone';
import Dealer from '../helpers/dealer';
import Rules from '../helpers/rules';

import io from 'socket.io-client';

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: 'Game',
    });
  }
  
  // load all assets
  preload() {
    this.load.image('cardBack', 'https://deckofcardsapi.com/static/img/back.png');

    this.load.image('AH', 'https://deckofcardsapi.com/static/img/AH.png');
    this.load.image('AS', 'https://deckofcardsapi.com/static/img/AS.png');
    this.load.image('AC', 'https://deckofcardsapi.com/static/img/AC.png');
    this.load.image('AD', 'https://deckofcardsapi.com/static/img/AD.png');

    this.load.image('KC', 'https://deckofcardsapi.com/static/img/KC.png');
    this.load.image('KD', 'https://deckofcardsapi.com/static/img/KD.png');
    this.load.image('KS', 'https://deckofcardsapi.com/static/img/KS.png');
    this.load.image('KH', 'https://deckofcardsapi.com/static/img/KH.png');

    this.load.image('QH', 'https://deckofcardsapi.com/static/img/QH.png');
    this.load.image('QD', 'https://deckofcardsapi.com/static/img/QD.png');
    this.load.image('QS', 'https://deckofcardsapi.com/static/img/QS.png');
    this.load.image('QC', 'https://deckofcardsapi.com/static/img/QC.png');

    this.load.image('JC', 'https://deckofcardsapi.com/static/img/JC.png');
    this.load.image('JS', 'https://deckofcardsapi.com/static/img/JS.png');
    this.load.image('JD', 'https://deckofcardsapi.com/static/img/JD.png');
    this.load.image('JH', 'https://deckofcardsapi.com/static/img/JH.png');

    this.load.image('0C', 'https://deckofcardsapi.com/static/img/0C.png');
    this.load.image('0S', 'https://deckofcardsapi.com/static/img/0S.png');
    this.load.image('0H', 'https://deckofcardsapi.com/static/img/0H.png');
    this.load.image('0D', 'https://deckofcardsapi.com/static/img/0D.png');

    this.load.image('9C', 'https://deckofcardsapi.com/static/img/9C.png');
    this.load.image('9D', 'https://deckofcardsapi.com/static/img/9D.png');
    this.load.image('9S', 'https://deckofcardsapi.com/static/img/9S.png');
    this.load.image('9H', 'https://deckofcardsapi.com/static/img/9H.png');

    this.load.image('8D', 'https://deckofcardsapi.com/static/img/8D.png');
    this.load.image('8S', 'https://deckofcardsapi.com/static/img/8S.png');
    this.load.image('8C', 'https://deckofcardsapi.com/static/img/8C.png');
    this.load.image('8H', 'https://deckofcardsapi.com/static/img/8H.png');

    this.load.image('7C', 'https://deckofcardsapi.com/static/img/7C.png');
    this.load.image('7H', 'https://deckofcardsapi.com/static/img/7H.png');
    this.load.image('7S', 'https://deckofcardsapi.com/static/img/7S.png');
    this.load.image('7D', 'https://deckofcardsapi.com/static/img/7D.png');

    this.load.image('6H', 'https://deckofcardsapi.com/static/img/6H.png');
    this.load.image('6C', 'https://deckofcardsapi.com/static/img/6C.png');
    this.load.image('6D', 'https://deckofcardsapi.com/static/img/6D.png');
    this.load.image('6S', 'https://deckofcardsapi.com/static/img/6S.png');

    this.load.image('5H', 'https://deckofcardsapi.com/static/img/5H.png');
    this.load.image('5D', 'https://deckofcardsapi.com/static/img/5D.png');
    this.load.image('5C', 'https://deckofcardsapi.com/static/img/5C.png');
    this.load.image('5S', 'https://deckofcardsapi.com/static/img/5S.png');

    this.load.image('4S', 'https://deckofcardsapi.com/static/img/4S.png');
    this.load.image('4C', 'https://deckofcardsapi.com/static/img/4C.png');
    this.load.image('4H', 'https://deckofcardsapi.com/static/img/4H.png');
    this.load.image('4D', 'https://deckofcardsapi.com/static/img/4D.png');

    this.load.image('3H', 'https://deckofcardsapi.com/static/img/3H.png');
    this.load.image('3D', 'https://deckofcardsapi.com/static/img/3D.png');
    this.load.image('3S', 'https://deckofcardsapi.com/static/img/3S.png');
    this.load.image('3C', 'https://deckofcardsapi.com/static/img/3C.png');

    this.load.image('2D', 'https://deckofcardsapi.com/static/img/2D.png');
    this.load.image('2S', 'https://deckofcardsapi.com/static/img/2S.png');
    this.load.image('2H', 'https://deckofcardsapi.com/static/img/2H.png');
    this.load.image('2C', 'https://deckofcardsapi.com/static/img/2C.png');
  }

  create() {
    let self = this;

    this.isPlayerA = false;
    this.opponentCards = [];

    self.data.set({
      isWarDeclared: false,
      winCardCount: 0,
      playerAPileData: {},
      playerBPileData: {},
      playerACardsRemaining: 0,
      playerBCardsRemaining: 0,
      playerACardsWon: 0,
      playerBCardsWon: 0,
      playerAColor: '#00ffff',
      playerBColor: '#ff69b4',
      isCardsDealt: false,
      disabledColor: '#808080',
      interactiveColor: '#FFFFFF',
      interactedColor: '#0000FF',
      resultColor: '#FF0000',
    })

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);
    this.dealer = new Dealer(this);

    // socket IO Server Responses
    // For production -- Point this to where server lives
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', function () {
      console.log('Connected!');
    });

    // Client recieves isPlayerA event from server
    this.socket.on('isPlayerA', function () {
      self.isPlayerA = true;
      self.currentPlayerRemaining.setColor(self.data.values.playerAColor);
      self.opponentRemaining.setColor(self.data.values.playerBColor);
      self.currentPlayerText.setText('Player A').setColor(self.data.values.playerAColor);
      self.opponentText.setText('Player B').setColor(self.data.values.playerBColor);
    });

    // Client recieves dealCards event from server
    this.socket.on('dealCards', function (deckId, playerAPile, playerBPile) {
      self.data.values.playerAPileData = {
        deckId,
        pile: playerAPile,
      };
      self.data.values.playerBPileData = {
        deckId,
        pile: playerBPile,
      };
      self.data.values.playerACardsRemaining = playerAPile.remaining;
      self.data.values.playerBCardsRemaining = playerBPile.remaining;

      // Control Switchable Text based on isPlayerA
      self.currentPlayerRemaining.setText(`${this.isPlayerA ? self.data.values.playerACardsRemaining : self.data.values.playerBCardsRemaining} CARDS REMAINING`);
      self.opponentRemaining.setText(`${this.isPlayerA ? self.data.values.playerBCardsRemaining : self.data.values.playerACardsRemaining} CARDS REMAINING`);

      self.dealer.dealCards(deckId, playerAPile, playerBPile);
      self.data.values.isCardsDealt = true;
      self.dealText.disableInteractive();
      self.dealText.setColor(self.data.values.disabledColor);
      self.playRoundText.setColor(self.data.values.interactiveColor);
    });

    // Client Recieves roundPlayed event from server
    this.socket.on('roundPlayed', function (playerAObj, playerBObj) {
      if (self.data.values.isWarDeclared) self.data.values.isWarDeclared = false;
      self.resultText.setText();

      self.data.values.playerACardsRemaining = playerAObj.pile.remaining;
      self.data.values.playerBCardsRemaining = playerBObj.pile.remaining;
      let playerACard = new Card(self);
      playerACard.render(((self.dropZone.x - 350) + 50), (self.dropZone.y), playerAObj.cards[0].code).disableInteractive();
      let playerBCard = new Card(self);
      playerBCard.render(((self.dropZone.x - 350) + 650), (self.dropZone.y), playerBObj.cards[0].code).disableInteractive();
      self.currentPlayerRemaining.setText(`${this.isPlayerA ? self.data.values.playerACardsRemaining : self.data.values.playerBCardsRemaining} CARDS REMAINING`);
      self.opponentRemaining.setText(`${this.isPlayerA ? self.data.values.playerBCardsRemaining : self.data.values.playerACardsRemaining} CARDS REMAINING`);

      // Determine Winner or War
      let PAV = playerAObj.cards[0].value;
      let PBV = playerBObj.cards[0].value;
      let rules = new Rules(self);
      let results = rules.findWinner(PAV, PBV);
      console.log(results, 'results');
      if (results === 'war') {
        self.data.values.isWarDeclared = true;
        self.resultText.setText('WAR DECLARED!');
        self.data.values.winCardCount += 2;
      } else {
        if (results === 'Player A') {
          self.resultText.setText('Player A Wins!');
          self.data.values.winCardCount += 2;
          self.data.values.playerACardsWon = (self.data.values.playerACardsWon + self.data.values.winCardCount);
          self.playerAWonText.setText(`Cards Won: ${self.data.values.playerACardsWon}`)
          self.data.values.winCardCount = 0;
        }
        if (results === 'Player B') {
          self.resultText.setText('Player B Wins!');
          self.data.values.winCardCount += 2;
          self.data.values.playerBCardsWon =  (self.data.values.playerBCardsWon + self.data.values.winCardCount);
          self.playerBWonText.setText(`Cards Won: ${self.data.values.playerBCardsWon}`)
          self.data.values.winCardCount = 0;
        }
      }
    });
    
    // Text On the Play Field
    // Text that switches locations based on isPlayerA
    this.currentPlayerRemaining = this.add.text(950, 645, [`${this.isPlayerA ? self.data.values.playerACardsRemaining : self.data.values.playerBCardsRemaining} CARDS REMAINING`]).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.playerBColor);
    this.opponentRemaining = this.add.text(950, 120, [`${this.isPlayerA ? self.data.values.playerBCardsRemaining : self.data.values.playerACardsRemaining} CARDS REMAINING`]).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.playerAColor);
    this.currentPlayerText = this.add.text(655, 730, ['Player B']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.playerBColor);
    this.opponentText = this.add.text(655, 30, ['Player A']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.playerAColor);

    // Text that does not Switch based on isPlayerA
    // TODO: Make this Text Display/Switch based on what player you are for a more interactive User Experience
    this.playerBNameText = this.add.text(955, 265, ['Player B']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.playerBColor);
    this.playerBWonText = this.add.text(955, 285, ['Cards Won: 0']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.playerBColor);

    this.playerANameText = this.add.text(355, 265, ['Player A']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.playerAColor);
    this.playerAWonText = this.add.text(355, 285, ['Cards Won: 0']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.playerAColor);

    this.resultText = this.add.text(640, 275, ['']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.resultColor);

    this.playRoundText = this.add.text(650, 360, ['Play Round!']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.disabledColor).setInteractive();

    this.dealText = this.add.text(75, 350, [' DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(self.data.values.interactiveColor).setInteractive();

    // client emits event to server to deal cards
    this.dealText.on('pointerdown', function () {
      self.socket.emit('dealCards');
    })

    // client emits event to server to Play Round
    this.playRoundText.on('pointerdown', function () {
      self.socket.emit('roundPlayed', self.data.values.playerAPileData, self.data.values.playerBPileData);
    })

    // Interactive Styling on useable Text
    this.dealText.on('pointerover', function () {
      if (!self.data.values.isCardsDealt) {
        self.dealText.setColor(self.data.values.interactedColor);
      }
    })
    this.dealText.on('pointerout', function () {
      if (!self.data.values.isCardsDealt) {
        self.dealText.setColor(self.data.values.interactiveColor);
      }
    })
    this.playRoundText.on('pointerover', function () {
      if (self.data.values.isCardsDealt) {
        self.playRoundText.setColor(self.data.values.interactedColor);
      }
    })
    this.playRoundText.on('pointerout', function () {
      if (self.data.values.isCardsDealt) {
        self.playRoundText.setColor(self.data.values.interactiveColor);
      }
    })

    // Left Drag and Drop Functionality for Future Games
    // this.input.on('dragstart', function (pointer, gameObject) {
    //   gameObject.setTint(0xff69b4);
    //   self.children.bringToTop(gameObject);
    // })

    // this.input.on('dragend', function(pointer, gameObject, dropped) {
    //   gameObject.setTint();
    //   if (!dropped) {
    //     gameObject.x = gameObject.input.dragStartX;
    //     gameObject.y = gameObject.input.dragStartY;
    //   }
    // })

    // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    //   gameObject.x = dragX;
    //   gameObject.y = dragY;
    // })

    // this.input.on('drop', function (pointer, gameObject, dropZone) {
    //   dropZone.data.values.cards++;
    //   gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
    //   gameObject.y = dropZone.y;
    //   gameObject.disableInteractive();
    // })
  }

  // update every frame - do updates/inputs/watch for things
  update() {

  }
  
}