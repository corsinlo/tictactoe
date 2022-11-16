import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';
import { PlayerModule } from './player/player.module';
@Module({
  imports: [GameModule, PlayerModule],
  controllers: [AppController],
  providers: [AppService, GameService],
})
export class AppModule {}
