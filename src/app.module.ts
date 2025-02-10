import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoDbConfig } from './config/mongo.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { AuctionModule } from './auction/auction.module';
import { CategoryModule } from './category/category.module';
import { FavouriteAuctionModule } from './favourite-auction/favourite-auction.module';
import { BidModule } from './bid/bid.module';
import { ReportModule } from './report/report.module';
import { TransactionModule } from './transaction/transaction.module';
import { FileModule } from './file/file.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { SocketGateway } from './socket/socket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDbConfig,
    }),
    UserModule,
    AuthModule,
    ReviewModule,
    NotificationModule,
    AuctionModule,
    CategoryModule,
    FavouriteAuctionModule,
    BidModule,
    ReportModule,
    TransactionModule,
    FileModule,
    ChatModule,
    MessageModule,
  ],
  providers: [SocketGateway],
})
export class AppModule {}
