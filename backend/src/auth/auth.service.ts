import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entity/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  private async issueTokens(user: UserEntity, res: Response) {
    const payload = { fullname: user.name, sub: user.id };

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: jwtConstants.secret,
        expiresIn: '7sec',
      },
    );

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '30d',
    });

    res.cookie('teamBoard-access-token', accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('teamBoard-refresh-token', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { user };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.getUser(loginDto.email);

    if (user && bcrypt.compare(loginDto.password, user.passwordHash)) {
      return user;
    }
    return null;
  }

  async register(registerDto: RegisterDto, res: Response) {
    const userExists = await this.usersService.getUser(registerDto.email);

    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const hatchedPassword = await bcrypt.hash(registerDto.password, 10);
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

    return this.issueTokens(user, res);
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) {
      throw new UnauthorizedException('refresh token not found');
    }
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      throw new UnauthorizedException('invalid or expired refresh token');
    }

    const userExists = await this.usersService.getUser(payload.email);

    if (!userExists) {
      throw new BadRequestException('user not found');
    }

    const expiresIn = 15000;
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    const accessToken = this.jwtService.sign(
      {
        ...payload,
        exp: expiration,
      },
      {
        secret: jwtConstants.secret,
      },
    );

    res.cookie('thex-access-token', accessToken, {
      httpOnly: true,
    });

    return accessToken;
  }

  async logout(res: Response) {
    res.clearCookie('teamBoard-access-token');
    res.clearCookie('refresh-token');
    return { message: 'Logged out' };
  }
}
