const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});
let players = [];

io.on('connection', function(socket) {
  console.log('A user connected: ' + socket.id);
  players.push(socket.id);
  console.log(players, 'players connected');

  if (players.length === 1) {
    io.emit('isPlayerA');
  }

  socket.on('dealCards', async function () {
    const getDecks = async () => {
      let deckId = '';
      let playerACards = [];
      let playerBCards = [];
      try {
        // Create a shuffled deck of cards
        const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const json = await res.json();
        deckId = json.deck_id
        console.log(json);
        // Draw 1/2 the deck, Create a Pile for Player A
        const res2 = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=26`);
        const json2 = await res2.json();
        for await (const card of json2.cards) {
          playerACards.push(card.code);
        }
        const playerAStringArray = playerACards.join(',')
        const pileARes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/playerAPile/add/?cards=${playerAStringArray}`);
        const pileAJson = await pileARes.json();
        // Draw other 1/2 the deck, Create Pile for Player B
        const res3 = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=26`);
        const json3 = await res3.json();
        for await (const card of json3.cards) {
          playerBCards.push(card.code);
        }
        const playerBStringArray = playerBCards.join(',')
        const pileBRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/playerBPile/add/?cards=${playerBStringArray}`);
        const pileBJson = await pileBRes.json();

        const returnObj = {
          deckId,
          playerAPile: {
            name: 'playerAPile',
            ...pileAJson?.piles?.playerAPile,
          },
          playerBPile: {
            name: 'playerBPile',
            ...pileBJson?.piles?.playerBPile,
          },
        }
        return returnObj;
      } catch (err) {
        console.log(err);
      }
    };
    const result = await getDecks();
    io.emit('dealCards', result.deckId, result.playerAPile, result.playerBPile);
  });

  socket.on('roundPlayed', async function (playerAPileData, playerBPileData) {
    try {
        const playerARes = await fetch(`https://deckofcardsapi.com/api/deck/${playerAPileData.deckId}/pile/${playerAPileData.pile?.name}/draw/?count=1`);
        const playerAJson = await playerARes.json();

        const playerBRes = await fetch(`https://deckofcardsapi.com/api/deck/${playerBPileData.deckId}/pile/${playerBPileData.pile?.name}/draw/?count=1`);
        const playerBJson = await playerBRes.json();

        const playerAObj = {
          cards: playerAJson.cards,
          pile: {
            name: playerAPileData.pile?.name,
            remaining: playerAJson.piles?.[playerAPileData.pile?.name]?.remaining,
          },
        };
        const playerBObj = {
          cards: playerBJson.cards,
          pile: {
            name: playerBPileData.pile?.name,
            remaining: playerBJson.piles?.[playerBPileData.pile?.name]?.remaining,
          },
        };
        io.emit('roundPlayed', playerAObj, playerBObj);
      } catch (err) {
        console.log(err);
      }
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected: ' + socket.id);
    players = players.filter((player) => player !== socket.id)
  });
});

http.listen(3000, function () {
  console.log('Server Started!');
})