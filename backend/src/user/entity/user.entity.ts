import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserEntity {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field({ defaultValue: false })
  isEmailVerified!: boolean;

  @Field({ defaultValue: true })
  isActive!: boolean;

  @Field({ nullable: true })
  lastLoginAt?: Date;
}
