import { IsString, IsOptional } from 'class-validator';

export class ProductTranslationDto {
  @IsString()
  language: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  id: number;
}
