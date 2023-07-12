import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import CustomBaseEntity from './base.entity';

@Entity()
export class Collection extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('json', { nullable: false })
  image: string;
}
