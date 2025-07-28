import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
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
