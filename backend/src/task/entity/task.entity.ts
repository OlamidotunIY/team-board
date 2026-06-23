import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TaskPriority, TaskStatus } from '../schema/task.schema';

registerEnumType(TaskStatus, { name: 'TaskStatus' });
registerEnumType(TaskPriority, { name: 'TaskPriority' });

@ObjectType()
export class TaskEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Field(() => TaskPriority)
  priority!: TaskPriority;

  @Field(() => ID)
  projectId!: string;

  @Field(() => ID, { nullable: true })
  assigneeId?: string;

  @Field(() => ID)
  reporterId!: string;

  @Field(() => [ID])
  watcherIds!: string[];

  @Field(() => ID)
  createdById!: string;

  @Field(() => ID, { nullable: true })
  parentTaskId?: string;

  @Field(() => [String])
  labels!: string[];

  @Field({ nullable: true })
  estimateMinutes?: number;

  @Field()
  order!: number;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
