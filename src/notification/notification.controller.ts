import { Controller, Get, HttpCode, Param, Put } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  @Auth()
  async getNotificationsByUser(@Param('_id') userId: Types.ObjectId) {
    return this.notificationService.getNotificationsByUser(userId);
  }

  @Put('read')
  @HttpCode(200)
  @Auth()
  async changeRead(@User('_id') userId: Types.ObjectId) {
    return this.notificationService.changeRead(userId);
  }
}
