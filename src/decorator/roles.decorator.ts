import { SetMetadata } from '@nestjs/common';

export enum Role {
  User = 2,
  Admin = 1,
}
export const ROLES_KEY = 'roles';
export const Roles = (roles: Role) => SetMetadata(ROLES_KEY, roles);
