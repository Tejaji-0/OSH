import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script'
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {}
  }
];
