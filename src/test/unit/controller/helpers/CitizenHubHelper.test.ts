import {
  activateRespondentApplicationsLink,
  checkIfRespondentIsSystemUser,
  statusesInOrderOfUrgency,
} from '../../../../main/controllers/helpers/CitizenHubHelper';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { CaseState } from '../../../../main/definitions/definition';
import { HubLinkNames } from '../../../../main/definitions/hub';
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
    [statusesInOrderOfUrgency[0], statusesInOrderOfUrgency[1]],
    [statusesInOrderOfUrgency[1], statusesInOrderOfUrgency[2]],
    [statusesInOrderOfUrgency[2], statusesInOrderOfUrgency[3]],
    [statusesInOrderOfUrgency[3], statusesInOrderOfUrgency[4]],
    [statusesInOrderOfUrgency[4], statusesInOrderOfUrgency[5]],
  ])('set hub link for respondent applications based on the following application statuses ([%s, %s])', (a, b) => {
    activateRespondentApplicationsLink([{ value: { status: a } }, { value: { status: b } }], userCase);
    expect(userCase?.hubLinksStatuses[HubLinkNames.RespondentApplications]).toBe(b);
  });

  it('should not set hub link for respondent applications to in progress if no applications exist', () => {
    activateRespondentApplicationsLink(undefined, userCase);
    expect(userCase?.hubLinksStatuses[HubLinkNames.RespondentApplications]).toBeUndefined();
  });
});
