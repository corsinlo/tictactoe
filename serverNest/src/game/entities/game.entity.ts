import * as mongoose from 'mongoose';

export const GameSchema = new mongoose.Schema({
  id: String,
  playerTurn: String,
  playBoard: [String],
});

export interface Game {
  id: string;
  player1: any;
  player2: any;
  playerTurn: any;
  playBoard: string[];
  status: string;
  winner: null;
}
