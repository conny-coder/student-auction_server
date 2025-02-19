import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
// @ts-ignore
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
  exports: [NotificationService],
})
export class NotificationModule {}
