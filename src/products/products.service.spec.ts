import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/product-translation.entity';
import { Like, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let productTranslationRepository: Repository<ProductTranslation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ProductTranslation),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productTranslationRepository = module.get<Repository<ProductTranslation>>(
      getRepositoryToken(ProductTranslation),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should successfully create a product with translations', async () => {
      const createProductDto: CreateProductDto = {
        sku: '12345',
        translations: [
          {
            id: 1,
            language: 'en',
            name: 'Product A',
            description: 'Description A',
          },
        ],
      };

      const product = new Product();
      product.sku = createProductDto.sku;
      product.translations = createProductDto.translations.map(
        (translationDto) => {
          const translation = new ProductTranslation();
          translation.language = translationDto.language;
          translation.name = translationDto.name;
          translation.description = translationDto.description;
          return translation;
        },
      );

      jest.spyOn(productRepository, 'create').mockReturnValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      const result = await service.createProduct(createProductDto);

      expect(result).toEqual(product);
      expect(productRepository.create).toHaveBeenCalledWith({
        sku: createProductDto.sku,
        translations: expect.any(Array),
      });
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('search', () => {
    it('should return a paginated list of products based on search term', async () => {
      const searchTerm = 'Product A';
      const page = 1;
      const pageSize = 10;
      const products = [new Product()];
      const total = 1;

      jest
        .spyOn(productRepository, 'findAndCount')
        .mockResolvedValue([products, total]);

      const result = await service.search(searchTerm, page, pageSize);

      expect(result).toEqual({
        data: products,
        total,
        page,
        pageSize,
      });
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['translations'],
        where: {
          translations: {
            name: Like(`%${searchTerm}%`),
          },
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });
    });
  });
});
