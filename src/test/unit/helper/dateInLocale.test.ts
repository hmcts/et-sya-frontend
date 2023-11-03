import { dateInLocale, datesStringToDateInLocale } from '../../../main/helper/dateInLocale';

describe('dateInLocale()', () => {
  test.each([
    [new Date('2024-03-25'), 'anyurl', '25 March 2024'],
    [new Date('2022-03-25'), 'www.web.com?lng=cy.com', '25 Mawrth 2022'],
    [new Date('2023-09-27'), '?lng=cy', '27 Medi 2023'],
  ])('.dateInLocale(%s, %s) returns %s', (date, url, expected) => {
    expect(dateInLocale(date, url)).toBe(expected);
  });
});

describe('datesStringToDateInLocale()', () => {
  test.each([
    ['2024-03-25', 'anyurl', '25 March 2024'],
    ['2022-03-25', 'www.web.com?lng=cy.com', '25 Mawrth 2022'],
    ['2023-09-27', '?lng=cy', '27 Medi 2023'],
    ['bad string', '?lng=cy', 'bad string'],
    ['2 October 2023', '?lng=en', '2 October 2023'],
    ['2 October 2023', '?lng=cy', '2 Hydref 2023'],
    ['', 'anyurl', ''],
  ])('.datesStringToDateInLocale(%s, %s) returns %s', (dateString, url, expected) => {
    expect(datesStringToDateInLocale(dateString, url)).toBe(expected);
  });
});
