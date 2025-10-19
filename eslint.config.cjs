// ESLint flat config for ESLint v9+
// eslint-disable-next-line no-undef
const js = require('@eslint/js');

// eslint-disable-next-line no-undef
module.exports = [
  {
    ignores: [
      '.github/**',
      'node_modules/**',
      'package-lock.json',
      'eslint.config.mjs',
      '.eslintrc.*',
      'jest.config.*',
      'Dockerfile'
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // Jest
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        it: 'readonly'
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {}
  }
];
