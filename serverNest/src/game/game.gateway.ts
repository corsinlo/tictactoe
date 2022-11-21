import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  WsResponse,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Socket, Server } from 'socket.io';
import { PlayerService } from 'src/player/player.service';
import { CreatePlayerDto } from 'src/player/dto/create-player.dto';
import { Logger } from '@nestjs/common';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
}) //could be empty //implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() //const server = http.createServer(); const io = socketIO(server);
  server: Server;

  private logger: Logger = new Logger('GameGateway');

  /*@SubscribeMessage('msgToServer')
  public handleMessage(client: Socket, data: any): Promise<WsResponse<any>> {
    return this.server.to(payload.id).emit('msgToClient', payload);
  }*/
  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
  ) {}

  @SubscribeMessage('createGame')
  create(
    @MessageBody() createPlayerDto: CreatePlayerDto,
    createGameDto: CreateGameDto,
    @MessageBody('name') data: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const gameId = this.playerService.makeKey();
    const player = this.playerService.createPlayer(
      socket.id,
      gameId,
      data,
      'X',
    );
    const game = this.gameService.createGame(gameId, player.id, null);
    //this.gameService.createRoom(gameId, socket);
    socket.join(gameId);
    this.server.emit('playerCreated', { player });
    this.server.emit('gameUpdated', { game });
    console.log(game);
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
    @ConnectedSocket() socket: Socket,
  ) {
    //extract specific keys out of the payload
    const game = this.gameService.getGame(gameId);
    this.logger.log(`Client connected: ${socket.id}`);
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
    const player = this.playerService.createPlayer(
      socket.id,
      gameId,
      name,
      'O',
    );
    game.player2 = player.id;
    game.status = 'playing';
    this.gameService.updateGame(game);
    console.log(game);
    //this.gameService.createRoom(gameId, socket); //socket.join(gameId);
    socket.join(gameId);
    console.log(gameId);
    socket.emit('playerCreated', { player });
    console.log(player);
    socket.emit('gameUpdated', { game });
    console.log(game);
    socket.broadcast.emit('gameUpdated', { game });
    socket.broadcast.emit('notification', {
      message: `${name} has joined the game.`,
    });
  }

  @SubscribeMessage('moveMade')
  move(client: Socket, data: any): Promise<WsResponse<any>> {
    const { player, square, gameId } = data;
    console.log(data);
    const game = this.gameService.getGame(gameId);
    const { playBoard = [], playerTurn, player1, player2 } = game;
    playBoard[square] = player.symbol;
    const nextTurnId = playerTurn === player1 ? player2 : player1;
    game.playerTurn = nextTurnId;
    game.playBoard = playBoard;
    this.gameService.updateGame(game);
    this.server.emit('gameUpdated', { game });

    const hasWon = this.gameService.checkWinner(playBoard);
    if (hasWon) {
      const winner = { ...hasWon, player };
      game.status = 'gameOver';
      this.gameService.updateGame(game);
      this.server.emit('gameUpdated', { game });
      this.server.emit('gameEnd', { winner });
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
  public afterInit(server: any): void {
    return this.logger.log('Initialized');
  }
  /*
  public handleDisconnect(client: Socket) {
    const player = this.playerService.getPlayer(client.id);
    if (player) {
      this.playerService.removePlayer(player.id);
    }
    return this.logger.log(`Client disconnected: ${client.id}`);
  }*/
}
