import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ default: false })
  isEmailVerified!: boolean;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  lastLoginAt!: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
