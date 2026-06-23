import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponse } from './dto/register.dto';
import { UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto, LoginResponse } from './dto/login.dto';
import { JwtAuthGuard } from './guards/gql-jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthUser } from '../common/interfaces/auth-user.interface';
import { UserEntity } from '../user/entity/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ) {
    const { user } = await this.authService.register(registerDto, context.res);
    return { user };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    return this.authService.logout(context.res);
  }

  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    return this.authService.refreshToken(context.req, context.res);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserEntity)
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
