import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { catsProviders } from './schema/user.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserResolver, ...catsProviders],
  exports: [
    UserService,
  ],
})
export class UserModule {}
