import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { redisClientProvider } from '../common/messaging/redis-client.provider';
import { ProjectModule } from '../project/project.module';
import { taskProviders } from './schema/task.provider';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [DatabaseModule, ProjectModule],
  providers: [TaskService, TaskResolver, ...taskProviders, redisClientProvider],
  exports: [TaskService, ...taskProviders],
})
export class TaskModule {}
