import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { LocationModel } from './location.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: LocationModel,
        schemaOptions: {
          collection: 'Location',
        },
      },
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
