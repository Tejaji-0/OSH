module.exports = {
  env: { node: true, es2023: true, jest: true },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  rules: {
    'node/no-unsupported-features/es-syntax': 'off'
  }
};
