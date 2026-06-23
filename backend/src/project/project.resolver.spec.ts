import { Test, TestingModule } from '@nestjs/testing';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

describe('ProjectResolver', () => {
  let resolver: ProjectResolver;
  const projectService = {
    create: jest.fn(),
    findAllForUser: jest.fn(),
    findOneForUser: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const user = { id: 'user-id', email: 'ada@test.com', name: 'Ada' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectResolver,
        { provide: ProjectService, useValue: projectService },
      ],
    }).compile();

    resolver = module.get<ProjectResolver>(ProjectResolver);
  });

  it('creates a project through the service', async () => {
    projectService.create.mockResolvedValue({ id: 'project-id' });

    await expect(resolver.createProject({ name: 'Build' }, user)).resolves.toEqual({
      id: 'project-id',
    });
  });

  it('deletes a project through the service', async () => {
    projectService.remove.mockResolvedValue(true);

    await expect(resolver.deleteProject('project-id', user)).resolves.toBe(true);
  });
});
