/**
 * Root Jest configuration for the Nebula monorepo.
 *
 * Uses the React Native preset so TypeScript sources and RN internals are
 * transformed consistently. Unit tests live next to the packages they cover
 * (packages/<pkg>/__tests__). Scaffolded templates under packages/template
 * and packages/cli/templates are starter fixtures, not workspace test targets,
 * so they are excluded here.
 */
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/packages/template/',
    '/packages/cli/templates/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/examples/',
    '<rootDir>/packages/template/',
    '<rootDir>/packages/cli/templates/',
    '<rootDir>/packages/*/dist/',
  ],
  clearMocks: true,
};
