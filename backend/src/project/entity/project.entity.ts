import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ProjectStatus, ProjectVisibility } from '../schema/project.schema';

registerEnumType(ProjectStatus, { name: 'ProjectStatus' });
registerEnumType(ProjectVisibility, { name: 'ProjectVisibility' });

@ObjectType()
export class ProjectEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ProjectStatus)
  status!: ProjectStatus;

  @Field(() => ProjectVisibility)
  visibility!: ProjectVisibility;

  @Field()
  color!: string;

  @Field(() => [String])
  tags!: string[];

  @Field(() => ID)
  ownerId!: string;

  @Field(() => [ID])
  memberIds!: string[];

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  progress!: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
