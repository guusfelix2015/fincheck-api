import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/shared/database/repositories/users.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  getUserById(userId: string) {
    return this.userRepo.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });
  }
}
