import {
  StatusesInOrderOfUrgency,
  activateRespondentApplicationsLink,
  checkIfRespondentIsSystemUser,
  getHubLinksUrlMap,
  getStoredPendingBannerList,
  shouldHubLinkBeClickable,
  shouldShowRespondentApplicationReceived,
  shouldShowRespondentResponseReceived,
  updateHubLinkStatuses,
  updateYourApplicationsStatusTag,
} from '../../../../main/controllers/helpers/CitizenHubHelper';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, languages } from '../../../../main/definitions/constants';
import { CaseState } from '../../../../main/definitions/definition';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../../../main/definitions/hub';
import { StoreNotification } from '../../../../main/definitions/storeNotification';
import mockUserCaseWithoutTseApp from '../../../../main/resources/mocks/mockUserCaseWithoutTseApp';
import {
  mockTseAdminClaimantRespondNotViewed,
  mockTseAdminClaimantRespondWaitingForTrib,
  mockTseRespondentRespondsToAdminRequestNotViewed,
  mockTseRespondentRespondsToAdminRequestWaitingForTrib,
} from '../../mocks/mockGenericTseCollection';
import mockUserCase from '../../mocks/mockUserCase';
import { clone } from '../../test-helpers/clone';

const DATE = 'August 19, 2022';

describe('updateHubLinkStatuses', () => {
  it('should set RespondentResponse hubLink status to WAITING_FOR_TRIBUNAL', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: DATE,
      lastModified: DATE,
      respondents: undefined,
      et3ResponseReceived: true,
    };

    const hubLinksStatuses: HubLinksStatuses = new HubLinksStatuses();
    hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.NOT_YET_AVAILABLE;

    updateHubLinkStatuses(userCase, hubLinksStatuses);

    expect(hubLinksStatuses[HubLinkNames.RespondentResponse]).toEqual(HubLinkStatus.WAITING_FOR_TRIBUNAL);
  });

  it('should set RespondentResponse hubLink status to READY_TO_VIEW', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: DATE,
      lastModified: DATE,
      respondents: undefined,
      responseAcknowledgementDocumentDetail: [
        {
          id: '5',
          description: 'desc',
        },
      ],
    };

    const hubLinksStatuses: HubLinksStatuses = new HubLinksStatuses();

    updateHubLinkStatuses(userCase, hubLinksStatuses);

    expect(hubLinksStatuses[HubLinkNames.RespondentResponse]).toEqual(HubLinkStatus.READY_TO_VIEW);
  });

  it('should set Et1ClaimForm hubLink status to NOT_VIEWED', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: DATE,
      lastModified: DATE,
      respondents: undefined,
      acknowledgementOfClaimLetterDetail: [
        {
          id: '5',
          description: 'desc',
        },
      ],
    };

    const hubLinksStatuses: HubLinksStatuses = new HubLinksStatuses();

    updateHubLinkStatuses(userCase, hubLinksStatuses);

    expect(hubLinksStatuses[HubLinkNames.Et1ClaimForm]).toEqual(HubLinkStatus.NOT_VIEWED);
  });
});

describe('checkIfRespondentIsSystemUser', () => {
  it('should return false if respondents is undefined', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: DATE,
      lastModified: DATE,
      respondents: undefined,
    };
    expect(checkIfRespondentIsSystemUser(userCase)).toEqual(false);
  });

  it('should return false if representatives is undefined', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: DATE,
      lastModified: DATE,
      respondents: [
        {
          ccdId: '1',
        },
      ],
      representatives: undefined,
    };
    expect(checkIfRespondentIsSystemUser(userCase)).toEqual(false);
  });

  it('should return false if some respondents dont have legal rep assigned', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: DATE,
      lastModified: DATE,
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
      ],
    };
    expect(checkIfRespondentIsSystemUser(userCase)).toEqual(false);
  });

  it('should return true if all respondents have legal rep assigne AND all the reps have the hasMyHMCTSAccount field set to Yes', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: DATE,
      lastModified: DATE,
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
    expect(checkIfRespondentIsSystemUser(userCase)).toEqual(true);
  });
});

describe('activateRespondentApplicationsLink', () => {
  let userCase: CaseWithId;
  beforeEach(() => {
    userCase = clone(mockUserCase);
  });

  test.each([
    [StatusesInOrderOfUrgency[0], StatusesInOrderOfUrgency[1]],
    [StatusesInOrderOfUrgency[1], StatusesInOrderOfUrgency[2]],
    [StatusesInOrderOfUrgency[2], StatusesInOrderOfUrgency[3]],
    [StatusesInOrderOfUrgency[3], StatusesInOrderOfUrgency[4]],
    [StatusesInOrderOfUrgency[4], StatusesInOrderOfUrgency[5]],
  ])('set hub status for respondent applications based on the following application statuses ([%s, %s])', (a, b) => {
    activateRespondentApplicationsLink(
      [{ value: { applicationState: a } }, { value: { applicationState: b } }],
      userCase
    );
    expect(userCase?.hubLinksStatuses[HubLinkNames.RespondentApplications]).toBe(a);
  });

  it('should not set hub status for respondent applications if no applications exist', () => {
    activateRespondentApplicationsLink(undefined, userCase);
    expect(userCase?.hubLinksStatuses[HubLinkNames.RespondentApplications]).toBeUndefined();
  });

  it('should set status to undefined when an illegal status', () => {
    activateRespondentApplicationsLink([{ value: { applicationState: 'jack' } }], userCase);
    expect(userCase?.hubLinksStatuses[HubLinkNames.RespondentApplications]).toBe(undefined);
  });
});

describe('shouldHubLinkBeClickable', () => {
  it('should not be clickable if not yet available', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.NOT_YET_AVAILABLE, undefined)).toBe(false);
  });

  it('should not be clickable if awaiting tribunal and not respondent applications', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.WAITING_FOR_TRIBUNAL, HubLinkNames.Documents)).toBe(false);
  });

  it('should be clickable if awaiting tribunal and not respondent applications', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.WAITING_FOR_TRIBUNAL, HubLinkNames.RespondentApplications)).toBe(
      true
    );
  });

  it('should not be clickable otherwise', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.IN_PROGRESS, undefined)).toBe(true);
  });
});

describe('updateYourApplicationsStatusTag', () => {
  let userCase: CaseWithId;
  beforeEach(() => {
    userCase = clone(mockUserCase);
  });

  test.each([
    [StatusesInOrderOfUrgency[0], StatusesInOrderOfUrgency[1]],
    [StatusesInOrderOfUrgency[1], StatusesInOrderOfUrgency[2]],
    [StatusesInOrderOfUrgency[2], StatusesInOrderOfUrgency[3]],
    [StatusesInOrderOfUrgency[3], StatusesInOrderOfUrgency[4]],
    [StatusesInOrderOfUrgency[4], StatusesInOrderOfUrgency[5]],
  ])('set hub status for claimant applications based on the following application statuses ([%s, %s])', (a, b) => {
    updateYourApplicationsStatusTag([{ value: { applicationState: a } }, { value: { applicationState: b } }], userCase);
    expect(userCase?.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(a);
  });

  it('Hublink status should be not avaliable yet if no claimant applications exist', () => {
    const userCaseWithoutClaimantApp = { ...mockUserCaseWithoutTseApp };
    expect(userCaseWithoutClaimantApp?.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(
      HubLinkStatus.NOT_YET_AVAILABLE
    );
  });
});

describe('update citizen hub status when different to application status', () => {
  let userCase: CaseWithId;
  beforeEach(() => {
    userCase = clone(mockUserCase);
    userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.WAITING_FOR_TRIBUNAL;
  });

  it('should update the hublink status to in progress when claimant responds to tribunal request', () => {
    userCase.genericTseApplicationCollection = mockTseAdminClaimantRespondWaitingForTrib;
    updateYourApplicationsStatusTag(userCase.genericTseApplicationCollection, userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(HubLinkStatus.IN_PROGRESS);
  });

  it('should update the hublink status to updated when respondent responds to tribunal request', () => {
    userCase.genericTseApplicationCollection = mockTseRespondentRespondsToAdminRequestWaitingForTrib;
    updateYourApplicationsStatusTag(userCase.genericTseApplicationCollection, userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(HubLinkStatus.UPDATED);
  });
});

describe('should not update citizen hub status', () => {
  let userCase: CaseWithId;
  beforeEach(() => {
    userCase = clone(mockUserCase);
    userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.NOT_VIEWED;
  });

  it('should not update the hublink status to in progress when claimant responds to tribunal request', () => {
    userCase.genericTseApplicationCollection = mockTseAdminClaimantRespondNotViewed;
    updateYourApplicationsStatusTag(userCase.genericTseApplicationCollection, userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(HubLinkStatus.NOT_VIEWED);
  });

  it('should not update the hublink status to updated when respondent responds to tribunal request', () => {
    userCase.genericTseApplicationCollection = mockTseRespondentRespondsToAdminRequestNotViewed;
    updateYourApplicationsStatusTag(userCase.genericTseApplicationCollection, userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(HubLinkStatus.NOT_VIEWED);
  });
});

describe('shouldShowRespondentResponseReceived', () => {
  test.each([
    [
      [
        {
          value: {
            respondCollection: [
              {
                value: {
                  from: Applicant.RESPONDENT,
                  copyToOtherParty: YesOrNo.YES,
                },
              },
            ],
          },
        },
      ],
      true,
    ],
    [
      [
        {
          value: {
            respondCollection: [
              {
                value: {
                  from: Applicant.CLAIMANT,
                },
              },
              {
                value: {
                  from: Applicant.RESPONDENT,
                  copyToOtherParty: YesOrNo.YES,
                },
              },
            ],
          },
        },
      ],
      true,
    ],
    [
      [
        {
          value: {
            respondCollection: [
              {
                value: {
                  from: Applicant.CLAIMANT,
                  copyToOtherParty: YesOrNo.YES,
                },
              },
            ],
          },
        },
      ],
      false,
    ],
    [
      [
        {
          value: {
            respondCollection: [
              {
                value: {
                  from: Applicant.RESPONDENT,
                },
              },
              {
                value: {
                  from: Applicant.CLAIMANT,
                  copyToOtherParty: YesOrNo.YES,
                },
              },
            ],
          },
        },
      ],
      false,
    ],
    [
      [
        {
          value: {
            respondCollection: [
              {
                value: {
                  from: Applicant.RESPONDENT,
                },
              },
              {
                value: {
                  from: Applicant.RESPONDENT,
                  copyToOtherParty: YesOrNo.NO,
                },
              },
            ],
          },
        },
      ],
      false,
    ],
  ])('for %j should return %s', (applications, expected) => {
    expect(shouldShowRespondentResponseReceived(applications)).toBe(expected);
  });
});

describe('shouldShowRespondentApplicationReceived', () => {
  test.each([
    [
      [
        {
          value: {
            applicationState: HubLinkStatus.NOT_STARTED_YET,
            claimantResponseRequired: YesOrNo.NO,
          },
        },
      ],
      true,
    ],
    [
      [
        {
          value: {
            applicationState: HubLinkStatus.IN_PROGRESS,
            claimantResponseRequired: YesOrNo.NO,
          },
        },
        {
          value: {
            applicationState: HubLinkStatus.NOT_STARTED_YET,
            claimantResponseRequired: YesOrNo.YES,
          },
        },
      ],
      false,
    ],
  ])('when %j return %s', (applications, expected) => {
    expect(shouldShowRespondentApplicationReceived(applications as GenericTseApplicationTypeItem[])).toBe(expected);
  });
});

describe('getHubLinksUrlMap', () => {
  it('returns correct links when respondent is system user in English', () => {
    const linksMap: Map<string, string> = new Map<string, string>([
      [HubLinkNames.Et1ClaimForm, PageUrls.CLAIM_DETAILS],
      [HubLinkNames.RespondentResponse, PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT],
      [HubLinkNames.ContactTribunal, PageUrls.CONTACT_THE_TRIBUNAL],
      [HubLinkNames.RequestsAndApplications, PageUrls.YOUR_APPLICATIONS],
      [HubLinkNames.RespondentApplications, PageUrls.RESPONDENT_APPLICATIONS],
      [HubLinkNames.TribunalOrders, PageUrls.TRIBUNAL_ORDERS_AND_REQUESTS],
      [HubLinkNames.TribunalJudgements, PageUrls.ALL_JUDGMENTS],
      [HubLinkNames.Documents, PageUrls.ALL_DOCUMENTS],
    ]);
    expect(getHubLinksUrlMap(true, languages.ENGLISH_URL_PARAMETER)).toEqual(linksMap);
  });

  it('returns correct links when respondent is system user in Welsh', () => {
    const linksMap: Map<string, string> = new Map<string, string>([
      [HubLinkNames.Et1ClaimForm, PageUrls.CLAIM_DETAILS + languages.WELSH_URL_PARAMETER],
      [
        HubLinkNames.RespondentResponse,
        PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT + languages.WELSH_URL_PARAMETER,
      ],
      [HubLinkNames.ContactTribunal, PageUrls.CONTACT_THE_TRIBUNAL + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RequestsAndApplications, PageUrls.YOUR_APPLICATIONS + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RespondentApplications, PageUrls.RESPONDENT_APPLICATIONS + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.TribunalOrders, PageUrls.TRIBUNAL_ORDERS_AND_REQUESTS + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.TribunalJudgements, PageUrls.ALL_JUDGMENTS + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.Documents, PageUrls.ALL_DOCUMENTS + languages.WELSH_URL_PARAMETER],
    ]);
    expect(getHubLinksUrlMap(true, languages.WELSH_URL_PARAMETER)).toEqual(linksMap);
  });

  it('returns correct links when respondent is non-system user in English', () => {
    const linksMap: Map<string, string> = new Map<string, string>([
      [HubLinkNames.Et1ClaimForm, PageUrls.CLAIM_DETAILS],
      [HubLinkNames.RespondentResponse, PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT],
      [HubLinkNames.ContactTribunal, PageUrls.RULE92_HOLDING_PAGE],
      [HubLinkNames.RequestsAndApplications, PageUrls.YOUR_APPLICATIONS],
      [HubLinkNames.RespondentApplications, PageUrls.RESPONDENT_APPLICATIONS],
      [HubLinkNames.TribunalOrders, PageUrls.RULE92_HOLDING_PAGE],
      [HubLinkNames.TribunalJudgements, PageUrls.ALL_JUDGMENTS],
      [HubLinkNames.Documents, PageUrls.ALL_DOCUMENTS],
    ]);
    expect(getHubLinksUrlMap(false, languages.ENGLISH_URL_PARAMETER)).toEqual(linksMap);
  });

  it('returns correct links when respondent is non-system user in Welsh', () => {
    const linksMap: Map<string, string> = new Map<string, string>([
      [HubLinkNames.Et1ClaimForm, PageUrls.CLAIM_DETAILS + languages.WELSH_URL_PARAMETER],
      [
        HubLinkNames.RespondentResponse,
        PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT + languages.WELSH_URL_PARAMETER,
      ],
      [HubLinkNames.ContactTribunal, PageUrls.RULE92_HOLDING_PAGE + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RequestsAndApplications, PageUrls.YOUR_APPLICATIONS + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RespondentApplications, PageUrls.RESPONDENT_APPLICATIONS + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.TribunalOrders, PageUrls.RULE92_HOLDING_PAGE + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.TribunalJudgements, PageUrls.ALL_JUDGMENTS + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.Documents, PageUrls.ALL_DOCUMENTS + languages.WELSH_URL_PARAMETER],
    ]);
    expect(getHubLinksUrlMap(false, languages.WELSH_URL_PARAMETER)).toEqual(linksMap);
  });
});

describe('getStoredPendingApplicationLinks', () => {
  it('should return /stored-to-submit with application id', () => {
    const tseCollection: GenericTseApplicationTypeItem[] = [
      {
        id: '123',
        value: {
          number: '2345',
          status: 'Stored',
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
          status: 'Stored',
        },
      },
    ];
    const expected: StoreNotification[] = [
      { viewUrl: '/stored-to-submit/123?lng=en' },
      { viewUrl: '/stored-to-submit/567?lng=en' },
    ];
    const actual = getStoredPendingBannerList(tseCollection, languages.ENGLISH_URL_PARAMETER);
    expect(actual).toEqual(expected);
  });
});
