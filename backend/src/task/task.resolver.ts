import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/gql-jwt.guard';
import type { AuthUser } from '../common/interfaces/auth-user.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entity/task.entity';
import { TaskService } from './task.service';

@Resolver(() => TaskEntity)
@UseGuards(JwtAuthGuard)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => TaskEntity)
  createTask(
    @Args('taskInput') dto: CreateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.taskService.create(dto, user);
  }

  @Query(() => [TaskEntity])
  tasks(
    @Args('projectId', { type: () => ID }) projectId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.taskService.findByProject(projectId, user);
  }

  @Query(() => TaskEntity)
  task(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.taskService.findOne(id, user);
  }

  @Mutation(() => TaskEntity)
  updateTask(
    @Args('taskInput') dto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.taskService.update(dto, user);
  }

  @Mutation(() => Boolean)
  deleteTask(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.taskService.remove(id, user);
  }
}
