import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { ValidateBanckAccountOwnershipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAcckountsRepo: BankAccountsRepository,
    private readonly validateBanckAccountOwnerShip: ValidateBanckAccountOwnershipService,
  ) {}

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { color, initialBalance, name, type } = createBankAccountDto;
    return this.bankAcckountsRepo.create({
      data: { userId, color, initialBalance, name, type },
    });
  }

  findAllByUserId(userId: string) {
    return this.bankAcckountsRepo.findMany({
      where: { userId },
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { color, initialBalance, name, type } = updateBankAccountDto;

    await this.validateBanckAccountOwnerShip.validate(userId, bankAccountId);

    return this.bankAcckountsRepo.update({
      where: { id: bankAccountId },
      data: { color, initialBalance, name, type },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateBanckAccountOwnerShip.validate(userId, bankAccountId);

    await this.bankAcckountsRepo.delete({
      where: { id: bankAccountId },
    });

    return null;
  }
}
