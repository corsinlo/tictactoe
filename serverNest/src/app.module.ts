import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://test:<>@cluster0.ezc5qgb.mongodb.net/test?retryWrites=true&w=majority',
    ),
    GameModule,
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
