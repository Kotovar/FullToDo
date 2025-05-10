import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  envDir: path.resolve(__dirname, '..'),
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
        'src/shared/config/msw/handlers',
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
      '@sharedCommon': path.resolve(__dirname, '../shared'),
    },
  },
});
