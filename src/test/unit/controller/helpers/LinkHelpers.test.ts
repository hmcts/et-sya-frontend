import {
  copyToOtherPartyRedirectUrl,
  getAppDetailsLink,
  getCancelLink,
} from '../../../../main/controllers/helpers/LinkHelpers';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, languages } from '../../../../main/definitions/constants';
import { CaseState } from '../../../../main/definitions/definition';
import { mockRequest } from '../../mocks/mockRequest';

describe('getCancelLink', () => {
  const req = mockRequest({});
  req.session.userCase = {
    id: '1',
    state: CaseState.SUBMITTED,
    createdDate: 'August 19, 2022',
    lastModified: 'August 19, 2022',
  };

  it('should return /citizen-hub with user id', () => {
    const expected = '/citizen-hub/1';
    const actual = getCancelLink(req);
    expect(actual).toEqual(expected);
  });
});

describe('getAppDetailsLink', () => {
  it('should return /application-details with application id', () => {
    const expected = '/application-details/1234?lng=en';
    const actual = getAppDetailsLink('1234', languages.ENGLISH_URL_PARAMETER);
    expect(actual).toEqual(expected);
  });
});

describe('copyToOtherPartyRedirectUrl', () => {
  it('should return /copy-to-other-party', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
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
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };
    const expected = PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
    const actual = copyToOtherPartyRedirectUrl(userCase);
    expect(actual).toEqual(expected);
  });
});
