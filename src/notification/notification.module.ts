import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { NotificationModel } from './notification.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: NotificationModel,
        schemaOptions: {
          collection: 'Notification',
        },
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
