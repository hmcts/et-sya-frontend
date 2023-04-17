import nunjucks from 'nunjucks';

function createFilters(env: nunjucks.Environment) {
  // to switch a string or an array of strings to titleCase
  env.addFilter('titleCase', function (input: string | string[]) {
    if (typeof input === 'string') {
      const words = input.split(' ');
      const titleCaseWords = words.map(function (word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
      return titleCaseWords.join(' ');
    } else if (Array.isArray(input)) {
      const titleCaseArray = input.map(function (str: string) {
        const words = str.split(' ');
        const titleCaseWords = words.map(function (word: string) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return titleCaseWords.join(' ');
      });
      return titleCaseArray;
    }
  });
}

module.exports = createFilters;
