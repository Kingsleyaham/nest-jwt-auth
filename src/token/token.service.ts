import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from 'src/constants';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async storeToken(accessToken: string, refreshToken: string) {
    return this.tokenModel.create({ accessToken, refreshToken });
  }

  async checkIfTokenExist(accessToken: string) {
    return this.tokenModel
      .findOne({ accessToken })
      .where('isValid')
      .equals(true);
  }

  async invalidateToken(accessToken: string) {
    const token = await this.checkIfTokenExist(accessToken);

    if (!token) throw new UnauthorizedException(MESSAGES.INVALID_TOKEN);

    token.isValid = false;

    return token.save();
  }
}
