import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { MESSAGES } from 'src/constants';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { parseId } from 'src/utils/parse-id.util';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './types/jwt-payload.interface';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
  @SkipAuth()
  @Get('logout')
  async logout(@Headers() headers: any) {
    try {
      const token = headers.authorization?.split(' ')[1] as string;

      if (!token) throw new BadRequestException(MESSAGES.LOGOUT_ERROR);

      await this.authService.logout(token);

      return { success: true, message: MESSAGES.LOGOUT_SUCCESS };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({
    summary: 'Create a new access token',
    description:
      'This endpoint makes an HTTP GET request to refresh the access token for the user. It does not require a request body. The response will include a status of 200 and a JSON object with a "success" boolean field indicating the success of the token refresh, and an "accessToken" field containing the new access token.',
  })
  @SkipAuth()
  @HttpCode(HttpStatus.CREATED)
  @Get('refresh')
  async handleRefreshToken(@Headers() headers: any) {
    try {
      const token = headers.authorization?.split(' ')[1] as string;
      const tokenExist = await this.authService.checkIfTokenExist(token);

      if (!tokenExist) throw new ForbiddenException(MESSAGES.INVALID_TOKEN);
      const { refreshToken } = tokenExist;
      const secret = this.configService.get<string>(
        'REFRESH_TOKEN_SECRET',
      ) as string;

      // console.log(refreshToken);
      // console.log(secret);

      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret,
        },
      );

      const { sub, email } = payload;

      const accessToken = await this.authService.generateAccessToken({
        email,
        sub: parseId(sub),
      });

      return { success: true, accessToken };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
