import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  link: string;

  @Column()
  description: string;

  @Column()
  productId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.video)
  comment: Comment[];
}
