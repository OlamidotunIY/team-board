import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  const projectModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };
  const user = { id: 'user-id', email: 'ada@test.com', name: 'Ada' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: 'PROJECT_MODEL', useValue: projectModel },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('creates a project owned by the current user', async () => {
    projectModel.create.mockResolvedValue({ id: 'project-id' });

    await expect(service.create({ name: 'Build' }, user)).resolves.toEqual({
      id: 'project-id',
    });
    expect(projectModel.create).toHaveBeenCalledWith({
      name: 'Build',
      ownerId: 'user-id',
    });
  });

  it('lists projects owned by or shared with the current user', async () => {
    const sort = jest.fn().mockResolvedValue([]);
    projectModel.find.mockReturnValue({ sort });

    await service.findAllForUser(user);

    expect(projectModel.find).toHaveBeenCalledWith({
      $or: [{ ownerId: 'user-id' }, { memberIds: 'user-id' }],
    });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it('throws when a project cannot be found for the user', async () => {
    projectModel.findOne.mockResolvedValue(null);

    await expect(service.findOneForUser('project-id', user)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
