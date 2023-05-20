import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/common/decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateUser } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    // TODO
    // add filter to search by specific fields like: role, email, etc
    // Limit the returned result and create pagination
    const users = await this.usersService.getAllUsers();

    return { users };
  }

  @Get(':id')
  async getUserById(@User() currentUser, @Param('id') userId: string) {
    if (currentUser.role === 'user' && currentUser.userId !== userId)
      throw new ForbiddenException('You only allowed to read your own data');

    const user = await this.usersService.getUserById(userId);

    if (!user) throw new NotFoundException('User is not found');

    return { user };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@User() currentUser, @Param('id') userId: string) {
    if (currentUser.role === 'user' && currentUser.userId !== userId)
      throw new ForbiddenException('You only allowed to delete your own data');

    const deletedUser = await this.usersService.deleteUser(userId);

    if (!deletedUser) throw new NotFoundException('User not found');

    return;
  }

  @SetMetadata('roles', ['admin'])
  @UseGuards(RolesGuard)
  @Post()
  async createUser(@Body() user: CreateUser) {
    const createdUser = await this.usersService.createUser(user);

    return { createdUser };
  }
}
