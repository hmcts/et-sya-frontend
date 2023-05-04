module.exports = {
  displayName: 'views',
  cache: true,
  roots: ['<rootDir>/src/test/unit/views'],
  testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/src/test/unit/mocks', '<rootDir>/src/test/unit/test-helpers'],
  testEnvironment: 'jest-environment-jsdom',
};
