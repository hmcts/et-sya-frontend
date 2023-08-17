module.exports = {
  roots: ['<rootDir>/src/test/api/pact'],
  testRegex: '(/src/test/api/pact.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': '@swc/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/src/test/api/pact/pact-test/settings/',
    '<rootDir>/src/test/api/pact/pactUtil.ts',
    '<rootDir>/src/test/api/pact/publish/publish.ts',
  ],
};
