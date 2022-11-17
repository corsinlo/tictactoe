import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { PlayerService } from 'src/player/player.service';

@Injectable()
export class GameService {
  constructor(private readonly playerService: PlayerService) {}
  //dummy obj game
  games: Game[] = [
    {
      id: '',
      player1: '',
      player2: null,
      playerTurn: '',
      playBoard: Array(9).fill(null),
      status: 'waiting',
      winner: null,
    },
  ];

  clientToPlayer = {};

  getClientName(clientId: string) {
    return this.clientToPlayer[clientId];
  }

  createGame(createGameDto: CreateGameDto, player) {
    const game = {
      ...createGameDto,
      id: player.gameId,
      player1: player.id,
      player2: null,
      playerTurn: player.id,
      playBoard: Array(9).fill(null),
      status: 'waiting',
      winner: null,
    };
    this.games.push(game);
    return game;
  }
  getGame(gameId: any): CreateGameDto {
    const game: CreateGameDto = this.games.find((game) => game.id === gameId);
    return game;
  }
  updateGame(game_: CreateGameDto, player2, status?: string) {
    console.log(`updating game with game id: ${game_.id}`);
    const index: number = this.games.findIndex((game) => game.id === game_.id);
    if (index === -1) {
      throw new Error('Post not found.');
    }
    const player2exist: boolean = this.games.some(
      (game) => game.player2 === player2.id && game.id !== player2.gameId,
    );
    if (player2exist) {
      throw new UnprocessableEntityException('Game is full');
    }
    const game: CreateGameDto = {
      ...game_,
      player2,
      status,
    };

    this.games[index] = game;
    return game;
  }

  identify(name: string, clientId: string) {}

  findAll() {
    return '';
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
