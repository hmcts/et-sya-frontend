import { dateInLocale, datesStringToDateInLocale } from '../../../main/helper/dateInLocale';

describe('dateInLocale()', () => {
  test.each([
    [new Date('2024-03-25'), 'anyurl', '25 March 2024'],
    [new Date('2022-03-25'), 'www.web.com?lng=cy.com', '25 Mawrth 2022'],
    [new Date('2023-09-27'), '?lng=cy', '27 Medi 2023'],
  ])('.dateInLocale(%s, %s)', (date, url, expected) => {
    expect(dateInLocale(date, url)).toBe(expected);
  });
});

describe('datesStringToDateInLocale()', () => {
  test.each([
    ['2024-03-25', 'anyurl', '25 March 2024'],
    ['2022-03-25', 'www.web.com?lng=cy.com', '25 Mawrth 2022'],
    ['2023-09-27', '?lng=cy', '27 Medi 2023'],
    ['bad string returned', '?lng=cy', 'bad string returned'],
    ['', 'anyurl', ''],
  ])('.dateInLocale(%s, %s) returns %s', (dateString, url, expected) => {
    expect(datesStringToDateInLocale(dateString, url)).toBe(expected);
  });
});
