import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{c,m,}{t,j}s', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {},
    rules: {
      'no-unused-expressions': 'error',
      'no-console': 'error',
      '@typescript-eslint/no-empty-function': 'off',
    },
    ignores: ['coverage/'],
  },
);
