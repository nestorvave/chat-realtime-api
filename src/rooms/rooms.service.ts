import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './entities/room.entity';
import { Model } from 'mongoose';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomsModel: Model<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      const room = await this.roomsModel.create(createRoomDto);
      return room;
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return `This action returns all rooms`;
  }

  async findByUser(id: string) {
    try {
      const rooms = await this.roomsModel
        .find({
          $or: [{ owner: id }, { users: { $elemMatch: { $eq: id } } }],
        })
        .populate('users')
        .exec();

      if (rooms.length === 0) {
        return [];
      }

      return rooms;
    } catch (error) {
      console.log(error);
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
