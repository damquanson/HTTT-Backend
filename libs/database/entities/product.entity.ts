import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import CustomBaseEntity from './base.entity';
import { Video } from './video.entity';
import { ImageProduct } from './imageProduct.entity';

@Entity()
export class Product extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({ type: 'text' })
  detail: string;

  @Column()
  size: string;

  @Column()
  color: string;

  @OneToMany(() => Video, (video) => video.product)
  video: Video[];

  @OneToMany(() => ImageProduct, (imageProduct) => imageProduct.product)
  imageProduct: ImageProduct[];
}
