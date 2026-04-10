import { ConflictError, NotFoundError } from '@errors/AppError';
import { UserRepository } from '@repositories/interfaces';
import type { CreateUser, DbUser } from '@sharedCommon/schemas';

export class MockUserRepository implements UserRepository {
  private users: DbUser[];
  private lastUserId: number = 1;

  private generateUserId(): number {
    return this.lastUserId++;
  }

  constructor(initialUsers: DbUser[]) {
    this.users = structuredClone(initialUsers);
  }

  async createUser(data: CreateUser): Promise<DbUser> {
    const { email, googleId, passwordHash } = data;
    if (this.users.some(user => user.email === email)) {
      throw new ConflictError(`User with email ${email} already exists`);
    }

    if (googleId && this.users.some(user => user.googleId === googleId)) {
      throw new ConflictError(`User with googleId ${googleId} already exists`);
    }

    const newUser = {
      userId: this.generateUserId(),
      email,
      passwordHash,
      googleId,
    };

    this.users.push(newUser);

    return newUser;
  }

  async findById(userId: number): Promise<DbUser | null> {
    const user = this.users.find(user => user.userId === userId);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<DbUser | null> {
    const user = this.users.find(user => user.email === email);
    return user ?? null;
  }

  async findByGoogleId(googleId: string): Promise<DbUser | null> {
    const user = this.users.find(user => user.googleId === googleId);
    return user ?? null;
  }

  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundError(`User with userId ${userId} not found`);
    }

    user.passwordHash = passwordHash;
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundError(`User with userId ${userId} not found`);
    }

    this.users = this.users.filter(user => user.userId !== userId);
  }
}
