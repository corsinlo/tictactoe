import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket, Server } from 'socket.io';
import { PlayerService } from 'src/player/player.service';
import { CreatePlayerDto } from 'src/player/dto/create-player.dto';
import { Logger, NotFoundException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
}) //could be empty
export class GameGateway {
  @WebSocketServer() //const server = http.createServer(); const io = socketIO(server);
  server: Server;

  handleConnection() {
    console.log('connection established');
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
    //const idm = this.gameService.identify(name, server.id); //server or socket?
    const id = client.id;
    const gameId = this.playerService.makeKey();
    const player = this.playerService.createPlayer(
      createPlayerDto,
      id,
      gameId,
      name,
      'X',
    );
    const game = this.gameService.createGame(createGameDto, player);
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
    const game_ = this.gameService.getGame(gameId);
    if (!game_) {
      this.server.emit('notification', {
        message: 'Invalid game id',
      });
      return;
    }
    const player2 = this.playerService.createPlayer(
      createPlayerDto,
      id,
      gameId,
      name,
      'O',
    );
    const game = this.gameService.updateGame(game_, player2.id, 'playing');
    client.join(gameId);
    this.server.emit('playerCreated', { player2 });
    this.server.emit('gameUpdated', { game });
    console.log(game);
    client.broadcast.emit('gameUpdated', { game });
    client.broadcast.emit('notification', {
      message: `${name} has joined the game.`,
    });

    /*
    if (game.player2 != null) {
      this.server.emit('notification', {
        message: 'Game is full',
      });
      return;
    }*/
  }

  /* displayAll(@ConnectedSocket() client: Socket, @MessageBody() name: string) {
  console.log(client.id);
  return this.gameService.identify(name, client.id);
  this.server.emit('name', name);
  console.log(name);
}*/
  @SubscribeMessage('findAllGame')
  findAll() {
    return this.gameService.findAll();
  }

  @SubscribeMessage('findOneGame')
  findOe(@MessageBody() id: number) {
    return this.gameService.findOne(id);
  }

  //add gameid
  @SubscribeMessage('joinGame')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return 0; //this.gameService.identify(name, client.id); socket.on('joinGame', ({ name, gameId }) => {...
  }

  @SubscribeMessage('moving')
  async Move() {
    //TODO
  }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
    return this.gameService.remove(id);
  }
}
