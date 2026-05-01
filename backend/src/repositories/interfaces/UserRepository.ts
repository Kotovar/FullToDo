import type { CreateUser, DbUser } from '@sharedCommon/schemas';

export interface UserRepository {
  createUser(data: CreateUser): Promise<DbUser>;
  markVerified(userId: number): Promise<boolean>;
  findById(userId: number): Promise<DbUser | null>;
  findByEmail(email: string): Promise<DbUser | null>;
  findByGoogleId(googleId: string): Promise<DbUser | null>;
  linkGoogleAccount(userId: number, googleId: string): Promise<DbUser>;
  changePassword(userId: number, passwordHash: string): Promise<void>;
  deleteUser(userId: number): Promise<void>;
}
