import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { PlayerService } from 'src/player/player.service';
import { Socket } from 'socket.io';
import { WsResponse } from '@nestjs/websockets';

@Injectable()
export class GameService {
  constructor(private readonly playerService: PlayerService) {}
  //dummy obj game
  games: Game[] = [];

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

  createGame(id: string, player1: any, player2: any) {
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
  getGame(gameId: any) {
    return this.games.find((game) => game.id === gameId);
  }
  updateGame(game) {
    const index = this.games.findIndex((g) => g.id === game.id);
    console.log(index);
    if (index !== -1) {
      this.games[index] = game;
    }
    this.games.push(game);
  }

  createRoom(data: string, socket: Socket) {
    socket.join(data);
    console.log(socket.id + ' joined room: ' + data);
    socket.to(data).emit('Joined room', data);
  }
  checkWinner(board: any[]) {
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
