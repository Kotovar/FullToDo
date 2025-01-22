import { loadEnv } from 'vite';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env': env,
    },
    plugins: [react()],
    test: {
      globals: true,
      setupFiles: ['./setupTests.ts'],
      environment: 'jsdom',
      css: true,
      passWithNoTests: true,
      mockReset: true,
      coverage: {
        provider: 'istanbul',
        exclude: [
          'src/main.tsx',
          'src/shared/i18n/config.ts',
          'src/shared/i18n/types/resources.ts',
          ...coverageConfigDefaults.exclude,
        ],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
