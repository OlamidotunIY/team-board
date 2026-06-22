import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../schema/task.schema';

@InputType()
export class UpdateTaskDto {
  @Field(() => ID)
  @IsMongoId()
  id!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(160)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  assigneeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
