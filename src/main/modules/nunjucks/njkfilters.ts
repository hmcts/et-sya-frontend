import nunjucks from 'nunjucks';

function createFilters(env: nunjucks.Environment) {
  // to switch a string to titleCase
  env.addFilter('titleCase', function (str: string) {
    const words = str.split(' ');
    const titleCaseWords = words.map(function (word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return titleCaseWords.join(' ');
  });
}

module.exports = createFilters;
