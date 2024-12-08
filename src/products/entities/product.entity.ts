import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductTranslation } from './product-translation.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @OneToMany(() => ProductTranslation, (translation) => translation.product, {
    cascade: true,
  })
  translations: ProductTranslation[];
}
