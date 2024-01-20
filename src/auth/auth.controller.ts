import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { MESSAGES } from 'src/constants';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Signup a new user',
    description:
      'This endpoint allows users to sign up by creating a new account. The HTTP POST request should be sent with the required user details in the request body.',
  })
  @SkipAuth()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);

      return { success: true, message: MESSAGES.CREATED };
    } catch (error) {
      console.error(error);

      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: 'Signin in a user',
    description:
      'This endpoint is used to authenticate a user and generate an access token for further API calls.',
  })
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    try {
      const { email, password } = loginDto;
      const { accessToken, user } = await this.authService.login(
        email,
        password,
      );

      return { success: true, accessToken, user };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: 'Logout user',
    description: 'This endpoint is used to log out the authenticated user.',
  })
  @Get('logout')
  async logout() {}

  @ApiOperation({
    summary: 'Create a new access token',
    description:
      'This endpoint makes an HTTP GET request to refresh the access token for the user. It does not require a request body. The response will include a status of 200 and a JSON object with a "success" boolean field indicating the success of the token refresh, and an "accessToken" field containing the new access token.',
  })
  @SkipAuth()
  @Get('refresh')
  async handleRefreshToken() {}
}
