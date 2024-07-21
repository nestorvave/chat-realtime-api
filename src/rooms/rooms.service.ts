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
      console.log("----");
      console.log(room);
      return room;
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return `This action returns all rooms`;
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
