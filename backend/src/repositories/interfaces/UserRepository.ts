import type { CreateUser, DbUser } from '@sharedCommon/schemas';

export interface UserRepository {
  createUser(data: CreateUser): Promise<DbUser>;
  markVerified(userId: number): Promise<void>;
  findById(userId: number): Promise<DbUser | null>;
  findByEmail(email: string): Promise<DbUser | null>;
  findByGoogleId(googleId: string): Promise<DbUser | null>;
  changePassword(userId: number, passwordHash: string): Promise<void>;
  deleteUser(userId: number): Promise<void>;
}
