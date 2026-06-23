import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  const userService = {
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('loads the current user', async () => {
    userService.getUserById.mockResolvedValue({ id: 'user-id' });

    await expect(
      resolver.currentUser({ id: 'user-id', email: 'a@test.com', name: 'Ada' }),
    ).resolves.toEqual({ id: 'user-id' });
  });

  it('updates the current user', async () => {
    userService.updateUser.mockResolvedValue({ id: 'user-id', name: 'Ada' });

    await expect(
      resolver.updateCurrentUser(
        { name: 'Ada' },
        { id: 'user-id', email: 'a@test.com', name: 'Old' },
      ),
    ).resolves.toEqual({ id: 'user-id', name: 'Ada' });
  });
});
