import { loadEnv } from 'vite';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env': env,
    },
    plugins: [react(), tailwindcss(), svgr()],
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
        '@app': path.resolve(__dirname, './src/app'),
        '@entities': path.resolve(__dirname, './src/entities'),
        '@features': path.resolve(__dirname, './src/features'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@widgets': path.resolve(__dirname, './src/widgets'),
      },
    },
  };
});
