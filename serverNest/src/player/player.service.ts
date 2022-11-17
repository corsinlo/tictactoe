import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  players: Player[] = [{ id: '', name: '', symbol: '', gameId: '' }];
  makeKey(length = 5) {
    return Math.random().toString(36).substr(2, length);
  }
  createPlayer(
    createPlayerDto: CreatePlayerDto,
    id,
    gameId,
    name,
    symbol?: string,
  ) {
    const player = {
      ...createPlayerDto,
      id: id,
      symbol,
      gameId: `${gameId}`,
    };
    this.players.push(player);
    return player;
  }

  findAll() {
    const test = 1;
    return test;
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }
}
