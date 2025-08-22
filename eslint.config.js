import eslintPluginPrettier from 'eslint-plugin-prettier'

/** @type {import("eslint").Linter.FlatConfig} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'curly': ['error', 'all'],
      'prettier/prettier': 'error',
    },
  },
]
