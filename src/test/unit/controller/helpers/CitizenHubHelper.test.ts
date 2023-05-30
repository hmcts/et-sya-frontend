import { checkIfRespondentIsSystemUser } from '../../../../main/controllers/helpers/CitizenHubHelper';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { CaseState } from '../../../../main/definitions/definition';

describe('checkIfRespondentIsSystemUser', () => {
  it('should return false if respondents is undefined', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
      respondents: undefined,
    };
    expect(checkIfRespondentIsSystemUser(userCase)).toEqual(false);
  });

  it('should return false if representatives is undefined', () => {
    const userCase: CaseWithId = {
      id: '1',
      state: CaseState.SUBMITTED,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
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
      ],
    };
    expect(checkIfRespondentIsSystemUser(userCase)).toEqual(false);
  });

  it('should return true if all respondents have legal rep assigne AND all the reps have the hasMyHMCTSAccount field set to Yes', () => {
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
    expect(checkIfRespondentIsSystemUser(userCase)).toEqual(true);
  });
});
