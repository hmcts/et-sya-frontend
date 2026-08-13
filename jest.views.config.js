module.exports = {
  displayName: 'views',
  cache: true,
  roots: ['<rootDir>/src/test/unit/views'],
  setupFiles: ['<rootDir>/jest.setup.views.js'],
  testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/src/test/unit/mocks', '<rootDir>/src/test/unit/test-helpers'],
  testEnvironment: '<rootDir>/jest.environment.jsdom.js',
  // View tests boot Express + Nunjucks; under maxWorkers this can exceed Jest's 5s default
  testTimeout: 15000,
  transform: {
    '^.+\\.(ts|tsx)$': '@swc/jest',
  },
};
