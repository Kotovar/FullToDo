import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
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
});
