import { Test, TestingModule } from '@nestjs/testing';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

describe('TaskResolver', () => {
  let resolver: TaskResolver;
  const taskService = {
    create: jest.fn(),
    findByProject: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const user = { id: 'user-id', email: 'ada@test.com', name: 'Ada' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskResolver, { provide: TaskService, useValue: taskService }],
    }).compile();

    resolver = module.get<TaskResolver>(TaskResolver);
  });

  it('creates a task through the service', async () => {
    taskService.create.mockResolvedValue({ id: 'task-id' });

    await expect(
      resolver.createTask({ title: 'Task', projectId: 'project-id' }, user),
    ).resolves.toEqual({ id: 'task-id' });
  });

  it('lists tasks for a project through the service', async () => {
    taskService.findByProject.mockResolvedValue([{ id: 'task-id' }]);

    await expect(resolver.tasks('project-id', user)).resolves.toEqual([
      { id: 'task-id' },
    ]);
  });
});
