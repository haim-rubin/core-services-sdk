import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 30000,
    hookTimeout: 30000,
    exclude: [
      'node_modules',
      'types/**',
      '**/*.d.ts',
      '**/index.js',
      'vitest.config.js',
    ],
    coverage: {
      include: ['src/**/*.js'],
      exclude: ['types/**', '**/*.d.ts', '**/index.js', 'vitest.config.js'],
    },
  },
})
