import { Module } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { ValidateBanckAccountOwnershipService } from './validate-bank-account-ownership.service';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService, ValidateBanckAccountOwnershipService],
  exports: [ValidateBanckAccountOwnershipService],
})
export class BankAccountsModule {}
