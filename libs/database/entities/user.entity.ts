import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import CustomBaseEntity from './base.entity';
import { Address } from './address.entity';
import { Video } from './video.entity';
import { Comment } from './comment.entity';

export enum UserRole {
  Admin = 1,
  User = 2,
}
@Entity()
export class User extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar' })
  gender: string;

  @Column()
  email: string;

  @Column()
  status: boolean;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  @Column()
  avatarUrl: string;

  @OneToMany(() => Address, (address) => address.user)
  address: Address;

  @OneToMany(() => Video, (video) => video.user)
  video: Video;

  @OneToMany(() => Comment, (comment) => comment.user)
  user: User;
}
