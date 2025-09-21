module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh'],
  env: { browser: true, es2022: true, node: true, jest: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier'
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
}
