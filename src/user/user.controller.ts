import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MESSAGES } from 'src/constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Fetch Users',
    description: 'This endpoint retrieves a list of users.',
  })
  @Get()
  async fetchUsers() {
    try {
      const users = await this.userService.findAll();

      return users;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: 'Get User Details',
    description:
      'This endpoint retrieves the details of a specific user by making a GET request to the specified URL request with the users ID',
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'user id',
    type: 'string',
    required: true,
  })
  async findOne(@Param('id') id: Types.ObjectId) {
    try {
      const user = await this.userService.findById(id);

      if (!user) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);

      return { success: true, user };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: 'Update User Details',
    description:
      'This API endpoint allows you to update a specific users information using the HTTP PATCH method.',
  })
  @ApiParam({
    name: 'id',
    description: 'user id',
    type: 'string',
    required: true,
  })
  @Patch(':id')
  async updateUser(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      await this.userService.update(id, updateUserDto);

      return { success: true, message: MESSAGES.UPDATED };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: 'Delete User',
    description:
      'This endpoint is used to delete a specific user by making an HTTP DELETE request to the provided URL. The request does not contain a request body',
  })
  @ApiParam({
    name: 'id',
    description: 'user id',
    type: 'string',
    required: true,
  })
  @Delete(':id')
  async deleteUser(@Param('id') id: Types.ObjectId) {
    try {
      await this.userService.remove(id);

      return { success: true, message: MESSAGES.DELETED };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
