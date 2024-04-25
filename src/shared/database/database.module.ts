import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/users.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { BankAccountsRepository } from './repositories/bank-accounts.repositories';

@Global()
@Module({
  exports: [UserRepository, CategoriesRepository, BankAccountsRepository],
  providers: [
    PrismaService,
    UserRepository,
    CategoriesRepository,
    BankAccountsRepository,
  ],
})
export class DatabaseModule {}
