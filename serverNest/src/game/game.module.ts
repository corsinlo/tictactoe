import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PlayerModule } from 'src/player/player.module';
@Module({
  imports: [PlayerModule],
  providers: [GameGateway, GameService],
})
export class GameModule {}
