import { IsArray, IsString } from 'class-validator';
import { ProductTranslationDto } from './translation.dto';

export class ProductDto {
  id: number;

  @IsString()
  sku: string;

  @IsArray()
  translations: ProductTranslationDto[];
}
