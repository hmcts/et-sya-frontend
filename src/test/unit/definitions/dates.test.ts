import { convertDateToCaseDate } from '../../../main/definitions/dates';

describe('convertDateToCaseDate()', () => {
  it.each([
    { date: new Date(2000, 0, 5), caseDate: { year: '2000', month: '1', day: '5' } },
    { date: new Date(2000, 10, 5), caseDate: { year: '2000', month: '11', day: '5' } },
    { date: new Date(2000, 11, 5), caseDate: { year: '2000', month: '12', day: '5' } },
  ])('should convert date to CaseDate correctly: %o', ({ date, caseDate }) => {
    expect(convertDateToCaseDate(date)).toMatchObject(caseDate);
  });
});
