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

  winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  createGame(id, player1, player2) {
    const newGame = {
      id,
      player1,
      player2,
      playerTurn: player1,
      playBoard: Array(9).fill(null),
      status: 'waiting',
      winner: null,
    };
    this.games.push(newGame);
    return newGame;
  }
  getGame(gameId: any): CreateGameDto {
    const game: CreateGameDto = this.games.find((game) => game.id === gameId);
    return game;
  }
  updateGame(game_: CreateGameDto) {
    const index = this.games.findIndex((g) => g.id === game_.id);
    this.games[index] = game_;
    return game_;
  }

  checkWinner(board) {
    for (let i = 0; i < this.winningCombinations.length; i++) {
      const [a, b, c] = this.winningCombinations[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {
          winningCombination: [a, b, c],
        };
      }
    }
    return null;
  }
}
