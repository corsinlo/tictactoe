import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PlayerModule } from 'src/player/player.module';
import { GameSchema } from './entities/game.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }]),
    PlayerModule,
  ],
  providers: [GameGateway, GameService],
})
export class GameModule {}
