import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../schema/user.schema';

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
export class UserEntity {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field()
  timezone!: string;

  @Field({ defaultValue: false })
  isEmailVerified!: boolean;

  @Field({ defaultValue: true })
  isActive!: boolean;

  @Field({ nullable: true })
  lastLoginAt?: Date;
}
