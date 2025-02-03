import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CategoryModel } from './category.model';
import { AuctionModule } from 'src/auction/auction.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CategoryModel,
        schemaOptions: {
          collection: 'Category',
        },
      },
    ]),
    AuctionModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
