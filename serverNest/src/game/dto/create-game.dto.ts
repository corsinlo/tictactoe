import { Game } from '../entities/game.entity';

export class CreateGameDto implements Game {
  id: string;
  player1: any;
  player2: any;
  playerTurn: any;
  playBoard: any[];
  status: string;
  winner: null;
} //New Game
