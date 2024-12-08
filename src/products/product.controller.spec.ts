import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductService = {
    createProduct: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = {
      sku: '12345',
      translations: [
        {
          language: 'en',
          name: 'Product 1',
          description: 'Description 1',
          id: 1,
        },
      ],
    };

    const result = new Product();
    result.sku = createProductDto.sku;
    result.translations = createProductDto.translations.map((translation) => ({
      ...translation,
      product: result,
    }));

    // Mock createProduct method to return the result
    mockProductService.createProduct.mockResolvedValue(result);

    // Call the controller method and verify the result
    const response = await controller.createProduct(createProductDto);
    expect(response).toEqual(result);
    expect(service.createProduct).toHaveBeenCalledWith(createProductDto);
  });

  it('should search for products', async () => {
    const searchTerm: string = 'Product'; // กำหนดเป็น string
    const page: number = 1; // กำหนดเป็น number
    const pageSize: number = 10; // กำหนดเป็น number

    const result = {
      data: [{ sku: '12345', translations: [] }], // Mock Product data
      total: 1,
      page,
      pageSize,
    };

    // Mock the search method to return the result
    mockProductService.search.mockResolvedValue(result);

    // Call the controller method and verify the result
    const response = await controller.search(page, pageSize, searchTerm);
    expect(response).toEqual(result);
    expect(service.search).toHaveBeenCalledWith(searchTerm, page, pageSize);
  });
});
