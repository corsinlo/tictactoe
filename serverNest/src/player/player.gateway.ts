import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { PlayerService } from './player.service';
import { UpdatePlayerDto } from './dto/update-player.dto';

@WebSocketGateway()
export class PlayerGateway {
  constructor(private readonly playerService: PlayerService) {}
}
