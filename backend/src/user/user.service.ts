import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from './schema/user.schema';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private user: Model<UserDocument>,
  ) {}

  async getUser(email: string) {
    return this.user.findOne({
      email,
    });
  }

  async createUser(dto: RegisterDto) {
    return this.user.create({
      name: dto.name,
      email: dto.email,
      passwordHash: dto.password,
      isEmailVerified: false,
    });
  }
}
