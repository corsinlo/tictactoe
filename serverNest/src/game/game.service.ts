import { Injectable } from '@nestjs/common';
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
      player2: '',
      playerTurn: '',
      playBoard: Array(9).fill(null),
      status: 'waiting',
      winner: null,
    },
  ];

  createGame(createGameDto: CreateGameDto) {
    const game = { ...createGameDto };
    this.games.push(game);
    return game;
  }

  findAll() {
    return this.games;
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
