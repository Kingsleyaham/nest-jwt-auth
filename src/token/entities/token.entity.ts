import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({ type: String, default: null })
  accessToken: string;

  @Prop({ type: String, default: null })
  refreshToken: string;

  @Prop({ type: Boolean, default: true })
  isValid: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.set('timestamps', true);
