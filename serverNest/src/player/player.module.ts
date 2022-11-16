import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerGateway } from './player.gateway';

@Module({
  providers: [PlayerGateway, PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
