import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  players: Player[] = [{ id: '', name: '', symbol: '', gameId: '' }];
  getPlayer(id: any) {
    return this.players.find((player) => player.id === id);
  }
  makeKey(length = 5) {
    return Math.random().toString(36).substr(2, length);
  }
  createPlayer(id, gameId, name, symbol?: string) {
    const player = {
      id,
      name,
      symbol,
      gameId,
    };
    this.players.push(player);
    return player;
  }
  removePlayer(id: any) {
    const index = this.players.findIndex((player) => player.id === id);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }
}
