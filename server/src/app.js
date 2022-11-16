const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

const { makeKey, checkWinner } = require('./util');
const { createGame, getGame, updateGame } = require('./data/games');
const { createPlayer, getPlayer, removePlayer } = require('./data/players');

const PORT = process.env.PORT || 3001;

io.on('connection', socket => {
  socket.on('disconnect', () => {
    const player = getPlayer(socket.id);
    if (player) {
      removePlayer(player.id);
    }
  });

  socket.on('createGame', ({ name }) => {
    const gameId = `game-${makeKey()}`;

    const player = createPlayer(socket.id, name, gameId, 'X');

    const game = createGame(gameId, player.id, null);

    socket.join(gameId);
    socket.emit('playerCreated', { player });
    socket.emit('gameUpdated', { game });

    socket.emit('notification', {
      message: `The game has been created. Game id: ${gameId}. Send this to your friend to join you`,
    });
    socket.emit('notification', {
      message: 'Waiting for opponent ...',
    });
  });

  socket.on('joinGame', ({ name, gameId }) => {

    const game = getGame(gameId);
    if (!game) {
      socket.emit('notification', {
        message: 'Invalid game id',
      });
      return;
    }

    if (game.player2) {
      socket.emit('notification', {
        message: 'Game is full',
      });
      return;
    }
  
    const player = createPlayer(socket.id, name, game.id, 'O');

    game.player2 = player.id;
    game.status = 'playing';
    updateGame(game);


    socket.join(gameId);
    socket.emit('playerCreated', { player });
    socket.emit('gameUpdated', { game });

    socket.broadcast.emit('gameUpdated', { game });
    socket.broadcast.emit('notification', {
      message: `${name} has joined the game.`,
    });
  });

  socket.on('moveMade', data => {
    const { player, square, gameId } = data;
 
    const game = getGame(gameId);
  
    const { playBoard = [], playerTurn, player1, player2 } = game;
    playBoard[square] = player.symbol;

    const nextTurnId = playerTurn === player1 ? player2 : player1;

    game.playerTurn = nextTurnId;
    game.playBoard = playBoard;
    updateGame(game);

    io.in(gameId).emit('gameUpdated', { game });

    const hasWon = checkWinner(playBoard);
    if (hasWon) {
      const winner = { ...hasWon, player };
      game.status = 'gameOver';
      updateGame(game);
      io.in(gameId).emit('gameUpdated', { game });
      io.in(gameId).emit('gameEnd', { winner });
      return;
    }

    const emptySquareIndex = playBoard.findIndex(item => item === null);
    if (emptySquareIndex === -1) {
      game.status = 'gameOver';
      updateGame(game);
      io.in(gameId).emit('gameUpdated', { game });
      io.in(gameId).emit('gameEnd', { winner: null });
      return;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is ready to play on port ${PORT}`);
});
