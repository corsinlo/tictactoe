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
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
}) //could be empty
export class GameGateway {
  @WebSocketServer() //const server = http.createServer(); const io = socketIO(server);
  server: Server;

  handleConnection() {
    console.log('new connection!');
  }

  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
  ) {}

  @SubscribeMessage('createGame')
  async createPlayer(@MessageBody() createPlayerDto: CreatePlayerDto) {
    const player = await this.playerService.createPlayer(createPlayerDto);
    this.server.emit('playerCreated', { player });
  }
  async createGame(@MessageBody() createGameDto: CreateGameDto) {
    const game = await this.gameService.createGame(createGameDto);
    this.server.emit('gameCreated', { game });
    return game; //back to sender
  }
  @SubscribeMessage('findAllGame')
  findAll() {
    return this.gameService.findAll();
  }

  @SubscribeMessage('findOneGame')
  findOe(@MessageBody() id: number) {
    return this.gameService.findOne(id);
  }

  @SubscribeMessage('updateGame')
  update(@MessageBody() updateGameDto: UpdateGameDto) {
    return this.gameService.update(updateGameDto.id, updateGameDto);
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
