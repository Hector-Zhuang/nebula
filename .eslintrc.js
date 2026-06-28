module.exports = {
  root: true,
  ignorePatterns: [
    '**/dist/**',
    '**/bin/**',
    '**/.eslintrc.js'
  ],
  extends: [
    '@react-native',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
