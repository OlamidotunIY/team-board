import { TaskEventsController } from './task-events.controller';

describe('TaskEventsController', () => {
  it('handles task lifecycle events without throwing', () => {
    const controller = new TaskEventsController();

    expect(() =>
      controller.handleTaskCreated({ taskId: 'task-id', projectId: 'project-id' }),
    ).not.toThrow();
    expect(() => controller.handleTaskUpdated({ taskId: 'task-id' })).not.toThrow();
    expect(() => controller.handleTaskDeleted({ taskId: 'task-id' })).not.toThrow();
  });
});
