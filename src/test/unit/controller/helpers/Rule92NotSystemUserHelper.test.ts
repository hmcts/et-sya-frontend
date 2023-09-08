import {
  copyToOtherPartyRedirectUrl,
  getAppDetailsLink,
  getCancelLink,
  getLatestApplication,
  getStoredPendingApplicationLinks,
} from '../../../../main/controllers/helpers/Rule92NotSystemUserHelper';
import { CaseWithId, YesOrNo, appStatus } from '../../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, languages } from '../../../../main/definitions/constants';
import { CaseState } from '../../../../main/definitions/definition';
import { mockRequest } from '../../mocks/mockRequest';

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

describe('getStoredPendingApplicationLinks', () => {
  it('should return /stored-to-submit with application id', () => {
    const req = mockRequest({});
    let tseCollection = req.session.userCase.genericTseApplicationCollection;
    tseCollection = [
      {
        id: '123',
        value: {
          number: '2345',
          status: appStatus.STORED,
        },
      },
      {
        id: '345',
        value: {
          number: '4567',
          status: 'Open',
        },
      },
      {
        id: '567',
        value: {
          number: '6789',
          status: appStatus.STORED,
        },
      },
    ];
    const expected: string[] = ['/stored-to-submit/123?lng=en', '/stored-to-submit/567?lng=en'];
    const actual = getStoredPendingApplicationLinks(tseCollection, languages.ENGLISH_URL_PARAMETER);
    expect(actual).toEqual(expected);
  });
});

describe('getLatestApplication', () => {
  const req = mockRequest({});
  const claimantItem1: GenericTseApplicationTypeItem = {
    id: '123',
    value: {
      applicant: Applicant.CLAIMANT,
      number: '2345',
      status: appStatus.STORED,
    },
  };
  req.session.userCase.genericTseApplicationCollection = [claimantItem1];
  const respondentItem1: GenericTseApplicationTypeItem = {
    id: '345',
    value: {
      applicant: Applicant.RESPONDENT,
      number: '4567',
      status: appStatus.STORED,
    },
  };
  req.session.userCase.genericTseApplicationCollection.push(respondentItem1);

  it('should return last application 123', () => {
    const expected = claimantItem1;
    const actual = getLatestApplication(req.session.userCase.genericTseApplicationCollection);
    expect(actual).toEqual(expected);
  });

  it('should return last application 345', () => {
    const claimantItem2: GenericTseApplicationTypeItem = {
      id: '567',
      value: {
        applicant: Applicant.CLAIMANT,
        number: '6789',
        status: 'Open',
      },
    };
    req.session.userCase.genericTseApplicationCollection.push(claimantItem2);

    const expected = claimantItem2;
    const actual = getLatestApplication(req.session.userCase.genericTseApplicationCollection);
    expect(actual).toEqual(expected);
  });
});
