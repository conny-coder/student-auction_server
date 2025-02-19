import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocationModule } from './location/location.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypegooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: getMongoDbConfig,
    // }),
    MongooseModule.forRoot(
      'mongodb+srv://shkambulak:conny_2004@cluster0.xmnzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    // UserModule,
    // AuthModule,
    // ReviewModule,
    // NotificationModule,
    // AuctionModule,
    // CategoryModule,
    // FavouriteAuctionModule,
    // BidModule,
    // ReportModule,
    // TransactionModule,
    // FileModule,
    // ChatModule,
    // MessageModule,
    LocationModule,
  ],
  // providers: [SocketGateway],
})
export class AppModule {}
