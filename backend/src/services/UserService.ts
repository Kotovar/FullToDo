import { userLogger } from '@logger';
import type { UserRepository } from '@repositories/interfaces';
import type { CreateUser, DbUser } from '@sharedCommon/schemas';

export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(data: CreateUser): Promise<DbUser> {
    userLogger.info({ user: data.email }, 'User created');
    return await this.repository.createUser(data);
  }

  async markVerified(userId: number): Promise<boolean> {
    return await this.repository.markVerified(userId);
  }
}
