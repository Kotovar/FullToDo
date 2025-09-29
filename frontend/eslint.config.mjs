import eslint from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactHooksExtra from 'eslint-plugin-react-hooks-extra';
import tseslint from 'typescript-eslint';
import pluginQuery from '@tanstack/eslint-plugin-query';

import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      'dist',
      'coverage',
      'eslint.config.mjs',
      'commitlint.config.ts',
      'vite.config.ts',
      'setupTests.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginQuery.configs['flat/recommended'],
  reactHooksExtra.configs.recommended,
  {
    files: ['**/*.{c,m,}{t,j}s', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-expressions': 'error',
      'no-console': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
]);
