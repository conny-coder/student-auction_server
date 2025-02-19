import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { AuctionService } from 'src/auction/auction.service';
import { CategoryModel } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    // @ts-ignore
    @InjectModel(CategoryModel)
    private readonly categoryModel: ModelType<CategoryModel>,
    private readonly auctionService: AuctionService,
  ) {}

  async getAll() {
    const categories = await this.categoryModel.find().exec();

    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await this.auctionService.getCountByCategory(
          category._id,
        );

        return {
          id: category._id,
          name: category.name,
          count: count,
          slug: category.slug,
        };
      }),
    );

    return categoryCounts;
  }

  async create(dto: CreateCategoryDto) {
    return await this.categoryModel.create({ ...dto });
  }

  async delete(id: Types.ObjectId) {
    return await this.categoryModel.findByIdAndDelete(id).exec();
  }
}
