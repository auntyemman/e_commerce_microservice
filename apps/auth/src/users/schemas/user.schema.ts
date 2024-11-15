import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RolesEnum } from '../dto/create-user.dto';
// import { AbstractDocument } from '@app/common';

export type UserDocument = User & Document;
@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ trim: true, required: true })
  username: string;

  @Prop({ trim: true, required: true, lowercase: true })
  email: string;

  @Prop({ trim: true, required: true })
  password: string;

  @Prop({ trim: true, required: true, default: RolesEnum.USER })
  roles: string[];

  @Prop({ trim: true, default: null })
  avatar: string;

  @Prop({ trim: true, default: null })
  createdBy: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
