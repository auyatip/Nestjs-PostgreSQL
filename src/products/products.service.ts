import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { ProductTranslation } from './entities/product-translation.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductTranslationDto } from './dto/translation.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const product = this.productRepository.create({
      sku: createProductDto.sku,
      translations: createProductDto.translations.map(
        (translationDto: ProductTranslationDto) => {
          const translation = new ProductTranslation();
          translation.language = translationDto.language;
          translation.name = translationDto.name;
          translation.description = translationDto.description;
          return translation;
        },
      ),
    });

    return await this.productRepository.save(product);
  }

  async search(searchTerm: string, page: number, pageSize: number) {
    const [products, total] = await this.productRepository.findAndCount({
      relations: ['translations'],
      where: {
        translations: {
          name: Like(`%${searchTerm}%`),
        },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return {
      data: products,
      total,
      page,
      pageSize,
    };
  }
}
