import nunjucks from 'nunjucks';

function createFilters(env: nunjucks.Environment): void {
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

  // Give each radio a fixed position and set size so screen readers don't count conditionally
  // revealed fields as extra options (WCAG 4.1.2). Dividers ("or") are not radios, so skip them.
  env.addFilter('radioPositions', function (items: RadioItem[]) {
    const setSize = items.filter(item => !item.divider).length;
    let position = 0;
    return items.map(item => {
      if (item.divider) {
        return item;
      }
      position++;
      return {
        ...item,
        attributes: { ...item.attributes, 'aria-posinset': position, 'aria-setsize': setSize },
      };
    });
  });
}

type RadioItem = { divider?: string; attributes?: Record<string, unknown> };

export default createFilters;
