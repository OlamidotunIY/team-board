import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  email!: string;

  @Prop()
  passwordHash!: string;

  @Prop()
  name!: string;

  @Prop({ default: false })
  isEmailVerified!: boolean;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  lastLoginAt!: Date;
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User);