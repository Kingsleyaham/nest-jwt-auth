import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import { Model, Types } from 'mongoose';
import { MESSAGES } from 'src/constants';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findById(id: Types.ObjectId) {
    return this.userModel
      .findById(id)
      .where('isDeleted')
      .equals(false)
      .select('id firstname surname username email avatar');
  }

  async findByUsername(username: string) {
    return this.userModel
      .findOne({ username })
      .where('isDeleted')
      .equals(false);
  }
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).where('isDeleted').equals(false);
  }

  async findAll() {
    return this.userModel
      .find({})
      .where('isDeleted')
      .equals(false)
      .select('id firstname surname username email avatar');
  }

  async create(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;
    const userExists = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!userExists) return this.userModel.create({ ...createUserDto });

    throw new BadRequestException(MESSAGES.USER_ALREADY_EXIST);
  }
  async update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    const userExists = await this.userModel.findById(id);

    if (!userExists) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);

    if (isEmpty(updateUserDto)) {
      throw new BadRequestException(MESSAGES.EMPTY_UPDATE_OBJECT);
    }

    return this.userModel.findByIdAndUpdate(id, { ...updateUserDto });
  }
  async remove(id: Types.ObjectId) {
    const userExists = await this.userModel.findById(id);

    if (!userExists) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
  }
}
