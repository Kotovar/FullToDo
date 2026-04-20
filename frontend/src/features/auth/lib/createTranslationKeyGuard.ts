import type { Translation } from '@shared/i18n';

type AuthTranslationScope = 'login' | 'register';

export const createTranslationKeyGuard =
  (scope: AuthTranslationScope) =>
  (value: string): value is Translation =>
    value.startsWith(`${scope}.`) || value.startsWith('errors.');
