import { getCaptionTextForCopyToOtherParty } from '../../../../main/controllers/helpers/CopyToOtherPartyHelper';
import { Rule92Types } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';

describe('getCaptionTextWithRequest', () => {
  const req = mockRequest({});

  it('should return Respond caption', () => {
    req.session.contactType = Rule92Types.RESPOND;
    const expected = 'Respond to an application';
    const actual = getCaptionTextForCopyToOtherParty(req);
    expect(actual).toEqual(expected);
  });
});
