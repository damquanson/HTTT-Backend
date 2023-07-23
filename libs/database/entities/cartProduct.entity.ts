import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import CustomBaseEntity from './base.entity';

@Entity()
export class CartProduct extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: Product;
}
