import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  id: any;
  player2: any;
  status: any;
}
