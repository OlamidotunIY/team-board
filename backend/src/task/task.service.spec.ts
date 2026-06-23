import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RABBITMQ_CLIENT } from '../common/messaging/rabbitmq-client.provider';
import { ProjectService } from '../project/project.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  const taskModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };
  const projectService = {
    findOneForUser: jest.fn(),
  };
  const eventClient = {
    emit: jest.fn(),
  };
  const user = { id: 'user-id', email: 'ada@test.com', name: 'Ada' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: 'TASK_MODEL', useValue: taskModel },
        { provide: ProjectService, useValue: projectService },
        { provide: RABBITMQ_CLIENT, useValue: eventClient },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('creates a task and emits a lifecycle event', async () => {
    projectService.findOneForUser.mockResolvedValue({ id: 'project-id' });
    taskModel.create.mockResolvedValue({ id: 'task-id' });

    await expect(
      service.create({ title: 'Task', projectId: 'project-id' }, user),
    ).resolves.toEqual({ id: 'task-id' });

    expect(taskModel.create).toHaveBeenCalledWith({
      title: 'Task',
      projectId: 'project-id',
      reporterId: 'user-id',
      createdById: 'user-id',
    });
    expect(eventClient.emit).toHaveBeenCalledWith('task.created', {
      taskId: 'task-id',
      projectId: 'project-id',
    });
  });

  it('throws when a task is not found', async () => {
    taskModel.findById.mockResolvedValue(null);

    await expect(service.findOne('task-id', user)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
