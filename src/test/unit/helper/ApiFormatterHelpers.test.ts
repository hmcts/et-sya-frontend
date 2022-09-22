import { convertClaimServedDateToRespondentDeadline } from '../../../main/helper/ApiFormatter';

describe('converts date strings to dates in the long format and adds 28 days', () => {
  it.each([
    { mockRef: '', expected: undefined },
    { mockRef: 'aa', expected: undefined },
    { mockRef: '2022-09-15T08:48:58.613343', expected: '13 October 2022' },
  ])('convert claim served date to respondent deadline', ({ mockRef, expected }) => {
    expect(convertClaimServedDateToRespondentDeadline(mockRef)).toEqual(expected);
  });
});
