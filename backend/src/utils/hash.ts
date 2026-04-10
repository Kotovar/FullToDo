import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');
