import nunjucks from 'nunjucks';

import createFilters from '../../../../../src/main/modules/nunjucks/njkFilters';

describe('njkFilters', () => {
  let env: nunjucks.Environment;

  beforeEach(() => {
    env = new nunjucks.Environment();
    createFilters(env);
  });

  describe('titleCase filter', () => {
    test('should convert a single string to title case', () => {
      const titleCaseFilter = env.getFilter('titleCase');
      const input = 'this is a test';
      const expectedOutput = 'This Is A Test';

      expect(titleCaseFilter(input)).toEqual(expectedOutput);
    });

    test('should convert an array of strings to title case', () => {
      const titleCaseFilter = env.getFilter('titleCase');
      const input = ['first test', 'second test'];
      const expectedOutput = ['First Test', 'Second Test'];

      expect(titleCaseFilter(input)).toEqual(expectedOutput);
    });

    test('should return an empty string when input is an empty string', () => {
      const titleCaseFilter = env.getFilter('titleCase');
      const input = '';
      const expectedOutput = '';

      expect(titleCaseFilter(input)).toEqual(expectedOutput);
    });

    test('should return an empty array when input is an empty array', () => {
      const titleCaseFilter = env.getFilter('titleCase');
      const input: string[] = [];
      const expectedOutput: string[] = [];

      expect(titleCaseFilter(input)).toEqual(expectedOutput);
    });
  });
});
