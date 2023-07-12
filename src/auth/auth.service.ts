import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { userInfo } from 'os';
import { ErrorMessage } from 'src/config/errors.config';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const userFound = await this.usersService.findOne(email);
    if (!userFound) throw new UnauthorizedException();
    if (!(await bcrypt.compare(pass, userFound.password))) {
      throw new UnauthorizedException('Username or password is Incorrect ');
    }
    const payload = {
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
    };
    const {password,...userInfo}=userFound
    return {
      userInfo:userInfo,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async getUserInfoFromToken(jwtToken:string){
    const isValid =await this.jwtService.verifyAsync(jwtToken)
    if(!isValid) throw new UnauthorizedException(ErrorMessage.TOKEN_INVALID)
  }
}
