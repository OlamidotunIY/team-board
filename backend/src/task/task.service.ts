import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { taskEvents } from '../common/events/task.events';
import { AuthUser } from '../common/interfaces/auth-user.interface';
import { REDIS_CLIENT } from '../common/messaging/redis-client.provider';
import { ProjectService } from '../project/project.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDocument } from './schema/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_MODEL')
    private readonly taskModel: Model<TaskDocument>,
    private readonly projectService: ProjectService,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: ClientProxy,
  ) {}

  async create(dto: CreateTaskDto, user: AuthUser) {
    await this.projectService.findOneForUser(dto.projectId, user);

    const task = await this.taskModel.create({
      ...dto,
      createdById: user.id,
    });

    this.redisClient.emit(taskEvents.created, {
      taskId: task.id,
      projectId: dto.projectId,
    });

    return task;
  }

  async findByProject(projectId: string, user: AuthUser) {
    await this.projectService.findOneForUser(projectId, user);
    return this.taskModel.find({ projectId }).sort({ createdAt: -1 });
  }

  async findOne(id: string, user: AuthUser) {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.projectService.findOneForUser(task.projectId.toString(), user);
    return task;
  }

  async update(dto: UpdateTaskDto, user: AuthUser) {
    await this.findOne(dto.id, user);

    const task = await this.taskModel.findByIdAndUpdate(
      dto.id,
      { $set: dto },
      { new: true },
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.redisClient.emit(taskEvents.updated, { taskId: task.id });
    return task;
  }

  async remove(id: string, user: AuthUser) {
    await this.findOne(id, user);
    const result = await this.taskModel.deleteOne({ _id: id });
    this.redisClient.emit(taskEvents.deleted, { taskId: id });
    return result.deletedCount === 1;
  }
}
