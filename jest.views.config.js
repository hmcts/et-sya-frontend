module.exports = {
  displayName: 'views',
  cache: true,
  roots: ['<rootDir>/src/test/unit/views'],
  testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/src/test/unit/mocks', '<rootDir>/src/test/unit/test-helpers'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': '@swc/jest',
  },
};
