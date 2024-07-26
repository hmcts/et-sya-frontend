import { isHearingExist } from '../../../../main/controllers/helpers/HearingHelpers';
import { mockHearingCollection } from '../../mocks/mockHearing';

describe('Hearing Helpers - isHearingExist', () => {
  it('should return true with future date', () => {
    const expected = isHearingExist(mockHearingCollection);
    expect(expected).toEqual(true);
  });

  it('should return undefined if no hearing', () => {
    const expected = isHearingExist(undefined);
    expect(expected).toEqual(undefined);
  });
});
