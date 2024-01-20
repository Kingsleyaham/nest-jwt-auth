import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, default: null })
  firstname: string;

  @Prop({ type: String, default: null })
  surname: string;

  @Prop({
    required: [true, 'username is required'],
    lowercase: true,
    trim: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: [true, 'email is required'],
    lowercase: true,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: [true, 'password is required'],
    minlength: [8, 'password must be atleast 8 character'],
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Prop({ lowercase: true, default: null })
  avatar: string;

  @Prop({ lowercase: true, default: null })
  cloudinaryId: string;

  @Prop({
    type: String,
    enum: ['user', 'admin'],
    lowercase: true,
    default: 'user',
  })
  role: string;

  @Prop({ type: String, default: null })
  @Exclude()
  verificationToken: string;

  @Prop({ type: Number, default: null })
  @Exclude()
  tokenExpiration: number;

  @Prop({ type: Boolean, default: false })
  @Exclude()
  isVerified: boolean;

  @Prop({ type: Boolean, default: false })
  @Exclude()
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  @Exclude()
  deletedAt: Date;

  @Expose()
  get fullName(): string {
    return `${this.firstname} ${this.surname}`;
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('timestamps', true);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
