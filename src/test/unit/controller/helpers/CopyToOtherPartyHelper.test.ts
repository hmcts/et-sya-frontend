import {
  copyToOtherPartyRedirectUrl,
  getCaptionText,
  getTodayPlus7DaysStrings,
} from '../../../../main/controllers/helpers/CopyToOtherPartyHelper';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, Rule92Types } from '../../../../main/definitions/constants';
import { CaseState } from '../../../../main/definitions/definition';
import { AnyRecord } from '../../../../main/definitions/util-types';
import { mockRequest } from '../../mocks/mockRequest';

describe('getTodayPlus7DaysStrings', () => {
  it('should return 7 days after today in GB format', () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    const expected = today.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const actual = getTodayPlus7DaysStrings();
    expect(actual).toEqual(expected);
  });
});

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

  it('should return /copy-correspondence-question', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: date,
      lastModified: date,
      respondents: undefined,
    };
    const expected = PageUrls.COPY_CORRESPONDENCE_QUESTION;
    const actual = copyToOtherPartyRedirectUrl(userCase);
    expect(actual).toEqual(expected);
  });
});

describe('getCaptionText', () => {
  const req = mockRequest({});
  const translations: AnyRecord = {
    respondToApplication: 'Respond to an application',
  };

  it('should return Respond caption', () => {
    req.session.contactType = Rule92Types.RESPOND;
    const expected = 'Respond to an application';
    const actual = getCaptionText(req, translations);
    expect(actual).toEqual(expected);
  });
});
