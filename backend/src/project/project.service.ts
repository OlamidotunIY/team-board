import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthUser } from '../common/interfaces/auth-user.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDocument } from './schema/project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_MODEL')
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  create(dto: CreateProjectDto, user: AuthUser) {
    return this.projectModel.create({ ...dto, ownerId: user.id });
  }

  findAllForUser(user: AuthUser) {
    return this.projectModel.find({ ownerId: user.id }).sort({ createdAt: -1 });
  }

  async findOneForUser(id: string, user: AuthUser) {
    const project = await this.projectModel.findOne({
      _id: id,
      ownerId: user.id,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(dto: UpdateProjectDto, user: AuthUser) {
    const project = await this.projectModel.findOneAndUpdate(
      { _id: dto.id, ownerId: user.id },
      { $set: dto },
      { new: true },
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async remove(id: string, user: AuthUser) {
    const result = await this.projectModel.deleteOne({
      _id: id,
      ownerId: user.id,
    });
    return result.deletedCount === 1;
  }
}
