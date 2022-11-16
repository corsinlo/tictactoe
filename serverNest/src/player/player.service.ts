import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  players: Player[] = [{ id: '', name: '', symbol: 'X', gameId: '' }];

  createPlayer(createPlayerDto: CreatePlayerDto) {
    const makeKey = (length = 5) => {
      return Math.random().toString(36).substr(2, length);
    };
    const player = { ...createPlayerDto, gameId: `game-${makeKey()}` };
    this.players.push(player);
    return player;
  }

  findAll() {
    return `This action returns all player`;
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
