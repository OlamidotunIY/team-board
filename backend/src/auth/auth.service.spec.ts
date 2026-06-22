import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = {
    getUser: jest.fn(),
    createUser: jest.fn(),
    markLastLogin: jest.fn(),
  };
  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };
  const configService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        JWT_ACCESS_SECRET: 'access-secret',
        JWT_REFRESH_SECRET: 'refresh-secret',
        JWT_ACCESS_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '30d',
      };
      return values[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('validates a user with a matching password', async () => {
    const passwordHash = await bcrypt.hash('password123', 4);
    usersService.getUser.mockResolvedValue({
      email: 'me@test.com',
      passwordHash,
    });

    await expect(
      service.validateUser({ email: 'me@test.com', password: 'password123' }),
    ).resolves.toEqual({ email: 'me@test.com', passwordHash });
  });

  it('rejects duplicate registration emails', async () => {
    usersService.getUser.mockResolvedValue({ id: 'user-id' });

    await expect(
      service.register(
        { name: 'Dotun', email: 'dotun@test.com', password: 'password123' },
        { cookie: jest.fn() } as never,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
