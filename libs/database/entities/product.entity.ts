import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import CustomBaseEntity from './base.entity';
import { Video } from './video.entity';

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

  @Column()
  detail: string;

  @Column()
  size: string;

  @Column('json', { nullable: false })
  imageArray: string[]; // or you can use a custom type if necessary

  @OneToMany(() => Video, (video) => video.product)
  video: Video[];
}
