import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/gql-jwt.guard';
import type { AuthUser } from '../common/interfaces/auth-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver(() => UserEntity)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserEntity)
  currentUser(@CurrentUser() user: AuthUser) {
    return this.userService.getUserById(user.id);
  }

  @Mutation(() => UserEntity, { nullable: true })
  updateCurrentUser(
    @Args('userInput') dto: UpdateUserDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.userService.updateUser(user.id, dto);
  }
}
