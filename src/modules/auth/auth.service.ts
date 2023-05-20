import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (user && (await this.comparePassword(password, user.password)))
      return user;
    return null;
  }

  private comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  private generateJwtAccessToken(payload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: 2 * 60 * 60, // 2 hours in seconds
    });
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) throw new UnauthorizedException('Invalid credentials!');

    const accessToken = await this.generateJwtAccessToken({
      sub: user.id,
      role: user.role,
    });

    user.password = undefined;

    return { user, accessToken };
  }

  async register(user) {
    const checkIfEmailAvailable = await this.usersService.getUserByEmail(
      user.email,
    );

    if (checkIfEmailAvailable) throw new BadRequestException('Email is in use');

    const createdUser = await this.usersService.createUser(user);

    const accessToken = await this.generateJwtAccessToken({
      sub: user.id,
      role: user.role,
    });

    createdUser.password = undefined;

    return { createdUser, accessToken };
  }
}
