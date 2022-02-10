import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import SQS from '../common/sqs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const queueUrl = `${process.env.SQS_QUEUE}${process.env.QUEUE_USER_SQS}`;

      const user = new this.userModel(createUserDto);
      const result = await user.save();
      const message = {
        id: result._id,
        name: result.name,
        email: result.email,
      };
      await SQS.sendToQueue(message, queueUrl);
      return result;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: updateUserDto,
        },
        {
          new: true,
        },
      )
      .exec();
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}
