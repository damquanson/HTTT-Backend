import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Address } from './address.entity';
import { OrderProduct } from './orderProduct.entity';

export enum OrderStatus {
  CONFIRMED = 'Confirmed',
  SHIPPING = 'Shipping',
  DONE = 'Done',
  CANCEL = 'Cancel',
}
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  addressId: number;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  total: number;

  @Column()
  status: OrderStatus;

  @Column()
  paymentMethod: string;

  @Column()
  note: string;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProduct: OrderProduct[];
}
