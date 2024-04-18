import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/users.repositories';

@Module({
  exports: [PrismaService, UserRepository],
  providers: [PrismaService, UserRepository],
})
export class DatabaseModule {}
