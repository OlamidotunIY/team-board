import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponse } from './dto/register.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto, LoginResponse } from './dto/login.dto';
import { LocalAuthGuard } from './guards/gql-local.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ) {
    const { user } = await this.authService.register(registerDto, context.res);
    return { user };
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    return this.authService.logout(context.res);
  }

  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    return this.authService.refreshToken(context.req, context.res);
  }
}
