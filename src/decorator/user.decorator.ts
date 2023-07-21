import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfoAuth {
  id: number;
  email: string;
}
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
