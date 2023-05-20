import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserById(id: string) {
    return this.userModel.findById(id);
  }

  async getAllUsers() {
    return this.userModel.find();
  }

  async createUser(user) {
    const createdUser = await this.userModel.create(user);
    createdUser.password = undefined;
    return createdUser;
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
    // return this.userModel.findOneAndDelete()
  }

  async updateUser(id: string) {}

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email }, ['+password']);
  }
}
