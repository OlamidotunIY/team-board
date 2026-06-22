import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { projectProviders } from './schema/project.provider';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [DatabaseModule],
  providers: [ProjectService, ProjectResolver, ...projectProviders],
  exports: [ProjectService, ...projectProviders],
})
export class ProjectModule {}
