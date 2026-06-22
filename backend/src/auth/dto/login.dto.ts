import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserEntity } from "../../user/entity/user.entity";

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  password!: string;
}

@ObjectType()
export class LoginResponse {
  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity;
}