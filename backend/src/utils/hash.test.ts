import { describe, test, expect } from 'vitest';
import { hashPassword, comparePassword, hashToken } from './hash';

describe('hashPassword', () => {
  test('returns a hash different from the original password', async () => {
    const hash = await hashPassword('MyPassword1');
    expect(hash).not.toBe('MyPassword1');
  });

  test('returns different hashes for the same password', async () => {
    const hash1 = await hashPassword('MyPassword1');
    const hash2 = await hashPassword('MyPassword1');
    expect(hash1).not.toBe(hash2);
  });
});

describe('comparePassword', () => {
  test('returns true for correct password', async () => {
    const hash = await hashPassword('MyPassword1');
    expect(await comparePassword('MyPassword1', hash)).toBe(true);
  });

  test('returns false for incorrect password', async () => {
    const hash = await hashPassword('MyPassword1');
    expect(await comparePassword('WrongPassword1', hash)).toBe(false);
  });
});

describe('hashToken', () => {
  test('returns a string', () => {
    expect(typeof hashToken('some-token')).toBe('string');
  });

  test('is deterministic — same input gives same output', () => {
    expect(hashToken('some-token')).toBe(hashToken('some-token'));
  });

  test('different tokens produce different hashes', () => {
    expect(hashToken('token-a')).not.toBe(hashToken('token-b'));
  });

  test('returns hex string of length 64 (sha256)', () => {
    expect(hashToken('some-token')).toHaveLength(64);
  });
});
