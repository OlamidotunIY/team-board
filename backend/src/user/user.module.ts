import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { userProviders } from './schema/user.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserResolver, ...userProviders],
  exports: [UserService, ...userProviders],
})
export class UserModule {}
