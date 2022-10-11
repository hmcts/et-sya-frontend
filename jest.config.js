module.exports = {
  coveragePathIgnorePatterns: ['<rootDir>/src/main/assets'],
  roots: ['<rootDir>/src/test/unit', '<rootDir>/src/test/routes'],
  testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/src/test/unit/mocks', '<rootDir>/src/test/unit/test-helpers'],
  testEnvironment: 'jsdom',
};
