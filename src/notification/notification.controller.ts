import { Controller, Get, HttpCode, Param, Put } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('unread')
  @Auth()
  async countUnreadByUser(@User('_id') userId: Types.ObjectId) {
    return this.notificationService.countUnreadByUser(userId);
  }

  @Get(':userId')
  @Auth()
  async getNotificationsByUser(@Param('userId') userId: Types.ObjectId) {
    return this.notificationService.getNotificationsByUser(userId);
  }


  @Put('read/:id')
  @HttpCode(200)
  @Auth()
  async changeRead(@User('_id') userId: Types.ObjectId, @Param('id') id: Types.ObjectId) {
    return this.notificationService.changeRead(userId, id);
  }

}
