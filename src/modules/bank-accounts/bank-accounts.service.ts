import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { ValidateBankAccountOwnershipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAcckountsRepo: BankAccountsRepository,
    private readonly validateBankAccountOwnerShip: ValidateBankAccountOwnershipService,
  ) {}

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { color, initialBalance, name, type } = createBankAccountDto;
    return this.bankAcckountsRepo.create({
      data: { userId, color, initialBalance, name, type },
    });
  }

  async findAllByUserId(userId: string) {
    const bankAccounts = await this.bankAcckountsRepo.findMany({
      where: { userId },
      include: {
        transactions: {
          select: { value: true, type: true },
        },
      },
    });

    return bankAccounts.map(({ transactions, ...bankAccount }) => {
      const totalTransactions = transactions.reduce((acc, transaction) => {
        return (
          acc +
          (transaction.type === 'INCOME'
            ? transaction.value
            : -transaction.value)
        );
      }, 0);

      const currentBalance = totalTransactions + bankAccount.initialBalance;

      return {
        ...bankAccount,
        currentBalance,
        transactions,
      };
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { color, initialBalance, name, type } = updateBankAccountDto;

    await this.validateBankAccountOwnerShip.validate(userId, bankAccountId);

    return this.bankAcckountsRepo.update({
      where: { id: bankAccountId },
      data: { color, initialBalance, name, type },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateBankAccountOwnerShip.validate(userId, bankAccountId);

    await this.bankAcckountsRepo.delete({
      where: { id: bankAccountId },
    });

    return null;
  }
}
