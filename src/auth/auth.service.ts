import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { MESSAGES } from 'src/constants';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

type TokenPayload = {
  sub: Types.ObjectId;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: TokenPayload) {
    const secret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    ) as string;

    return this.jwtService.signAsync(payload, { expiresIn: '3h', secret });
  }

  async generateRefreshToken(payload: TokenPayload) {
    const secret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    ) as string;

    return this.jwtService.signAsync(payload, { expiresIn: '3d', secret });
  }

  async checkIfTokenExist(token: string) {
    return this.tokenService.checkIfTokenExist(token);
  }

  /**
   * Logins a user in follwing the following steps
   * - checks if the provided email matches a user email. throws an error otherwise
   * - compares the provided password with password in database. throws an error if both passwords doesn't match
   * - checks if users account has been verified. throws an error otherwise
   * - generate access token and refresh token;
   * - store both token in database
   */
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException(MESSAGES.INVALID_EMAIL_PWD);

    // const { password: dbPassword, _id: userId } = user;

    const pwdMatch = await bcrypt.compare(password, user?.password);

    if (!pwdMatch) throw new UnauthorizedException(MESSAGES.INVALID_EMAIL_PWD);

    if (!user?.isVerified) {
      throw new UnauthorizedException(MESSAGES.USER_UNVERIFIED);
    }

    const accessToken = await this.generateAccessToken({
      sub: user?._id,
      email: user?.email,
    });

    const refreshToken = await this.generateRefreshToken({
      sub: user?._id,
      email: user?.email,
    });

    await this.tokenService.storeToken(accessToken, refreshToken);

    const newUser = await this.userService.findById(user?._id);

    return { accessToken, user: newUser };
  }

  async logout(token: string) {
    return this.tokenService.invalidateToken(token);
  }
}
