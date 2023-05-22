module.exports = {
  displayName: 'views',
  cache: true,
  roots: ['<rootDir>/src/test/unit/views'],
  transform: {
  '\\.[jt]sx?$': 'babel-jest'
  },
  testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/src/test/unit/mocks', '<rootDir>/src/test/unit/test-helpers'],
  testEnvironment: 'jsdom',
};
