import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators';

import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginDTO) {
    const { user, accessToken } = await this.authService.login(email, password);

    return { accessToken, user };
  }

  @Public()
  @Post('register')
  async register(@Body() { name, email, password }: RegisterDTO) {
    const { createdUser, accessToken } = await this.authService.register({
      name,
      email,
      password,
    });

    return { accessToken, createdUser };
  }
}
