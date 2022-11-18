import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Socket, Server } from 'socket.io';
import { PlayerService } from 'src/player/player.service';
import { CreatePlayerDto } from 'src/player/dto/create-player.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
}) //could be empty
export class GameGateway {
  @WebSocketServer() //const server = http.createServer(); const io = socketIO(server);
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connection established');
    const player = this.playerService.getPlayer(client.id);
    if (player) {
      this.playerService.removePlayer(player.id);
    }
  }

  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
  ) {}

  @SubscribeMessage('createGame')
  create(
    @MessageBody() createPlayerDto: CreatePlayerDto,
    createGameDto: CreateGameDto,
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    const id = client.id;
    const gameId = this.playerService.makeKey();
    const player = this.playerService.createPlayer(id, gameId, name, 'X');
    const game = this.gameService.createGame(gameId, player.id, null);
    client.join(gameId);
    this.server.emit('playerCreated', { player });
    this.server.emit('gameUpdated', { game });
    console.log(player);
    this.server.emit('notification', {
      message: `The game has been created. Game id: ${game.id}. Send this to your friend to join you`,
    });
    this.server.emit('notification', {
      message: 'Waiting for opponent ...',
    });
  }
  @SubscribeMessage('joinGame')
  update(
    @MessageBody('gameId') gameId: string,
    @MessageBody('name') name: string,
    createPlayerDto: CreatePlayerDto,
    createGameDto: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    //extract specific keys out of the payload
    const id = client.id;
    const game = this.gameService.getGame(gameId);
    if (!game) {
      this.server.emit('notification', {
        message: 'Invalid game id',
      });
      return;
    }
    if (game.player2) {
      this.server.emit('notification', {
        message: 'Game is full',
      });
      return;
    }
    const player = this.playerService.createPlayer(id, gameId, name, 'O');
    game.player2 = player.id;
    game.status = 'playing';
    this.gameService.updateGame(game);
    client.join(gameId);
    this.server.emit('playerCreated', { player });
    console.log(player);
    this.server.emit('gameUpdated', { game });
    console.log(game);
    client.broadcast.emit('gameUpdated', { game });
    client.broadcast.emit('notification', {
      message: `${name} has joined the game.`,
    });
  }

  @SubscribeMessage('moveMade')
  move(@MessageBody() data: any) {
    const { player, square, gameId } = data;
    const game = this.gameService.getGame(gameId);
    const { playBoard = [], playerTurn, player1, player2 } = game;
    playBoard[square] = player.symbol;
    const nextTurnId = playerTurn === player1 ? player2 : player1;
    game.playerTurn = nextTurnId;
    game.playBoard = playBoard;
    this.gameService.updateGame(game);
    this.server.in(gameId).emit('gameUpdated', { game });

    const hasWon = this.gameService.checkWinner(playBoard);
    if (hasWon) {
      const winner = { ...hasWon, player };
      game.status = 'gameOver';
      this.gameService.updateGame(game);
      this.server.in(gameId).emit('gameUpdated', { game });
      this.server.in(gameId).emit('gameEnd', { winner });
      return;
    }
    const emptySquareIndex = playBoard.findIndex((item) => item === null);
    if (emptySquareIndex === -1) {
      game.status = 'gameOver';
      this.gameService.updateGame(game);
      this.server.in(gameId).emit('gameUpdated', { game });
      this.server.in(gameId).emit('gameEnd', { winner: null });
      return;
    }
  }
}
