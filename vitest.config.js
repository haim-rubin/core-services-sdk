export default {
  test: {
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      exclude: ['**/index.js', 'vitest.config.js'],
    },
  },
}
