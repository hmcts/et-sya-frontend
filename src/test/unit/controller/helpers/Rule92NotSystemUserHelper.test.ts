import { getCaptionTextForCopyToOtherParty } from '../../../../main/controllers/helpers/CopyToOtherPartyHelper';
import { copyToOtherPartyRedirectUrl } from '../../../../main/controllers/helpers/Rule92NotSystemUserHelper';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, Rule92Types } from '../../../../main/definitions/constants';
import { CaseState } from '../../../../main/definitions/definition';
import { mockRequest } from '../../mocks/mockRequest';

describe('copyToOtherPartyRedirectUrl', () => {
  const date = 'August 19, 2022';

  it('should return /copy-to-other-party', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: date,
      lastModified: date,
      respondents: [
        {
          ccdId: '1',
        },
        {
          ccdId: '2',
        },
      ],
      representatives: [
        {
          respondentId: '1',
          hasMyHMCTSAccount: YesOrNo.YES,
        },
        {
          respondentId: '2',
          hasMyHMCTSAccount: YesOrNo.YES,
        },
      ],
    };
    const expected = PageUrls.COPY_TO_OTHER_PARTY;
    const actual = copyToOtherPartyRedirectUrl(userCase);
    expect(actual).toEqual(expected);
  });

  it('should return /copy-to-other-party-not-system-user', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: date,
      lastModified: date,
      respondents: undefined,
    };
    const expected = PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
    const actual = copyToOtherPartyRedirectUrl(userCase);
    expect(actual).toEqual(expected);
  });
});

describe('getCaptionTextWithRequest', () => {
  const req = mockRequest({});

  it('should return Respond caption', () => {
    req.session.contactType = Rule92Types.RESPOND;
    const expected = 'Respond to an application';
    const actual = getCaptionTextForCopyToOtherParty(req);
    expect(actual).toEqual(expected);
  });
});
