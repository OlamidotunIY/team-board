import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const userModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: 'USER_MODEL', useValue: userModel }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('selects passwordHash when finding by email for auth', async () => {
    const select = jest.fn().mockResolvedValue({ email: 'ada@test.com' });
    userModel.findOne.mockReturnValue({ select });

    await expect(service.getUser('ada@test.com')).resolves.toEqual({
      email: 'ada@test.com',
    });
    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'ada@test.com' });
    expect(select).toHaveBeenCalledWith('+passwordHash');
  });

  it('updates profile data', async () => {
    userModel.findByIdAndUpdate.mockResolvedValue({ id: 'user-id', name: 'Ada' });

    await expect(service.updateUser('user-id', { name: 'Ada' })).resolves.toEqual({
      id: 'user-id',
      name: 'Ada',
    });
  });
});
