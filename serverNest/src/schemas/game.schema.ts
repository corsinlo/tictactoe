import * as mongoose from 'mongoose';
export const GameSchema = new mongoose.Schema({
  gameId: String,
  playerTurn: String,
  playBoard: Array,
  date: String,
});
