import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { ProductTranslationDto } from './translation.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsArray()
  @IsNotEmpty()
  translations: ProductTranslationDto[];
}
