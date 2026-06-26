import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { authCookieNames, localJwtFallbacks } from './constants';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entity/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private getCookieOptions(maxAge: number) {
    return {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      maxAge,
    };
  }

  private userPayload(user: UserDocument | UserEntity) {
    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private async issueTokens(user: UserDocument, res: Response) {
    const payload = this.userPayload(user);
    const accessToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_ACCESS_SECRET') ??
        localJwtFallbacks.accessSecret,
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ??
        '7d') as never,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ??
        localJwtFallbacks.refreshSecret,
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ??
        '30d') as never,
    });

    res.cookie(
      authCookieNames.accessToken,
      accessToken,
      this.getCookieOptions(7 * 24 * 60 * 60 * 1000),
    );
    res.cookie(
      authCookieNames.refreshToken,
      refreshToken,
      this.getCookieOptions(30 * 24 * 60 * 60 * 1000),
    );

    return { user, accessToken };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.getUser(loginDto.email);

    if (user && (await bcrypt.compare(loginDto.password, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async register(registerDto: RegisterDto, res: Response) {
    const userExists = await this.usersService.getUser(registerDto.email);

    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const hatchedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.createUser({
      ...registerDto,
      password: hatchedPassword,
    });

    return this.issueTokens(user, res);
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new BadRequestException({
        invaildCredentials: 'Invalid credentials',
      });
    }

    await this.usersService.markLastLogin(user.id);

    return this.issueTokens(user, res);
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.[authCookieNames.refreshToken];
    if (!refreshToken) {
      throw new UnauthorizedException('refresh token not found');
    }
    let payload: { sub: string; email: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ??
          localJwtFallbacks.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('invalid or expired refresh token');
    }

    const userExists = await this.usersService.getUser(payload.email);

    if (!userExists) {
      throw new BadRequestException('user not found');
    }

    const accessToken = await this.jwtService.signAsync(
      this.userPayload(userExists),
      {
        secret:
          this.configService.get<string>('JWT_ACCESS_SECRET') ??
          localJwtFallbacks.accessSecret,
        expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ??
          '15m') as never,
      },
    );

    res.cookie(
      authCookieNames.accessToken,
      accessToken,
      this.getCookieOptions(15 * 60 * 1000),
    );

    return accessToken;
  }

  async logout(res: Response) {
    res.clearCookie(authCookieNames.accessToken);
    res.clearCookie(authCookieNames.refreshToken);
    return "Logout successful";
  }
}
