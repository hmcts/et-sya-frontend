module.exports = {
  displayName: 'unit',
  testEnvironment: 'node',
  cache: true,
  coveragePathIgnorePatterns: ['<rootDir>/src/main/assets'],
  roots: ['<rootDir>/src/test/unit', '<rootDir>/src/test/routes'],
  testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/src/test/unit/mocks',
    '<rootDir>/src/test/unit/test-helpers',
    '<rootDir>/src/test/unit/views',
  ],
  moduleNameMapper: {
    '^uuid$': '<rootDir>/node_modules/uuid/dist/cjs/index.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': '@swc/jest',
  },
};
