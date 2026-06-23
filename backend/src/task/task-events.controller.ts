import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { taskEvents } from '../common/events/task.events';

@Controller()
export class TaskEventsController {
  private readonly logger = new Logger(TaskEventsController.name);

  @EventPattern(taskEvents.created)
  handleTaskCreated(@Payload() payload: { taskId: string; projectId: string }) {
    this.logger.log(`Task created: ${payload.taskId} in ${payload.projectId}`);
  }

  @EventPattern(taskEvents.updated)
  handleTaskUpdated(@Payload() payload: { taskId: string }) {
    this.logger.log(`Task updated: ${payload.taskId}`);
  }

  @EventPattern(taskEvents.deleted)
  handleTaskDeleted(@Payload() payload: { taskId: string }) {
    this.logger.log(`Task deleted: ${payload.taskId}`);
  }
}
