import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions-accounts.repositories';
import { ValidateBankAccountOwnershipService } from '../bank-accounts/validate-bank-account-ownership.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { ValidateCategoryOwnershipService } from '../categories/services/validate-category-ownership.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from './entities/Transaction';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: TransactionsRepository,
    private readonly validateBankAccountOwnerShip: ValidateBankAccountOwnershipService,
    private readonly validateCategoryOwnerShip: ValidateCategoryOwnershipService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, categoryId, date, name, type, value } =
      createTransactionDto;
    await this.validateEntitiesOwnership({
      userId,
      bankAccountId,
      categoryId,
    });
    return this.transactionsRepo.create({
      data: {
        userId,
        categoryId,
        bankAccountId,
        date,
        name,
        type,
        value,
      },
    });
  }

  findAllByUserId(
    userId: string,
    filters: {
      month: number;
      year: number;
      bankAccountId?: string;
      type?: TransactionType;
    },
  ) {
    return this.transactionsRepo.findMany({
      where: {
        userId,
        bankAccountId: filters.bankAccountId,
        type: filters.type,
        date: {
          gte: new Date(Date.UTC(filters.year, filters.month)),
          lt: new Date(Date.UTC(filters.year, filters.month + 1)),
        },
      },
    });
  }

  update(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { bankAccountId, categoryId, date, name, type, value } =
      updateTransactionDto;

    this.validateEntitiesOwnership({
      userId,
      bankAccountId,
      categoryId,
      transactionId,
    });

    return this.transactionsRepo.update({
      where: {
        id: transactionId,
      },
      data: {
        categoryId,
        bankAccountId,
        date,
        name,
        type,
        value,
      },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateTransactionOwnership(userId, transactionId);

    await this.transactionsRepo.delete({
      where: {
        id: transactionId,
      },
    });
    return null;
  }

  private async validateTransactionOwnership(
    userId: string,
    transactionId: string,
  ) {
    const isOwner = await this.transactionsRepo.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!isOwner) {
      throw new Error('Transaction does not belong to user');
    }
  }

  private async validateEntitiesOwnership({
    userId,
    bankAccountId,
    categoryId,
    transactionId,
  }: {
    userId: string;
    bankAccountId: string;
    categoryId: string;
    transactionId?: string;
  }) {
    await Promise.all([
      transactionId && this.validateTransactionOwnership(userId, transactionId),
      this.validateBankAccountOwnerShip.validate(userId, bankAccountId),
      this.validateCategoryOwnerShip.validate(userId, categoryId),
    ]);
  }
}
