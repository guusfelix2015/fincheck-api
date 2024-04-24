import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/users.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';

@Global()
@Module({
  exports: [UserRepository, CategoriesRepository],
  providers: [PrismaService, UserRepository, CategoriesRepository],
})
export class DatabaseModule {}
