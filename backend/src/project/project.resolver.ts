import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/gql-jwt.guard';
import type { AuthUser } from '../common/interfaces/auth-user.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './entity/project.entity';
import { ProjectService } from './project.service';

@Resolver(() => ProjectEntity)
@UseGuards(JwtAuthGuard)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => ProjectEntity)
  createProject(
    @Args('projectInput') dto: CreateProjectDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectService.create(dto, user);
  }

  @Query(() => [ProjectEntity])
  projects(@CurrentUser() user: AuthUser) {
    return this.projectService.findAllForUser(user);
  }

  @Query(() => ProjectEntity)
  project(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectService.findOneForUser(id, user);
  }

  @Mutation(() => ProjectEntity)
  updateProject(
    @Args('projectInput') dto: UpdateProjectDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectService.update(dto, user);
  }

  @Mutation(() => Boolean)
  deleteProject(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectService.remove(id, user);
  }
}
