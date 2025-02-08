import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  create(@User('_id') senderId: Types.ObjectId, @Body() dto: CreateMessageDto) {
    return this.messageService.create(senderId, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth()
  delete(@Param('id') id: Types.ObjectId) {
    return this.messageService.delete(id);
  }
}
