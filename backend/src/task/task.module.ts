import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { rabbitMqClientProvider } from '../common/messaging/rabbitmq-client.provider';
import { ProjectModule } from '../project/project.module';
import { taskProviders } from './schema/task.provider';
import { TaskEventsController } from './task-events.controller';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [DatabaseModule, ProjectModule],
  controllers: [TaskEventsController],
  providers: [TaskService, TaskResolver, ...taskProviders, rabbitMqClientProvider],
  exports: [TaskService, ...taskProviders],
})
export class TaskModule {}
