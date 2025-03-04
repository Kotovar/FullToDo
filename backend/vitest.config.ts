import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./setupTests.ts'],
    environment: 'node',
    passWithNoTests: true,
    mockReset: true,
    coverage: {
      provider: 'istanbul',
      exclude: [...coverageConfigDefaults.exclude, 'src/app.ts'],
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
});
