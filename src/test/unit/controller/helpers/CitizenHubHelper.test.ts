import {
  StatusesInOrderOfUrgency,
  activateRespondentApplicationsLink,
  checkIfRespondentIsSystemUser,
  getHubLinksUrlMap,
  shouldHubLinkBeClickable,
} from '../../../../main/controllers/helpers/CitizenHubHelper';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { CaseState } from '../../../../main/definitions/definition';
import { HubLinkNames, HubLinkStatus } from '../../../../main/definitions/hub';
import mockUserCase from '../../mocks/mockUserCase';
import { clone } from '../../test-helpers/clone';

describe('checkIfRespondentIsSystemUser', () => {
  const DATE = 'August 19, 2022';

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

describe('getHubLinksUrlMap', () => {
  it('return correct links when respondent is sytem user', () => {
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
    expect(getHubLinksUrlMap(true)).toEqual(linksMap);
  });

  it('return correct links when respondent is non sytem user', () => {
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
    expect(getHubLinksUrlMap(false)).toEqual(linksMap);
  });
});
