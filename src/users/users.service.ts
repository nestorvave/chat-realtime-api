import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.create(createUserDto);
    return newUser;
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
  async findOneById(_id: string) {
    return await this.userModel.findOne({ _id });
  }

  async findAll() {
    return await this.userModel.find().select('-password');
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
