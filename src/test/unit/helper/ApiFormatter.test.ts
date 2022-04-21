import { UserDetails } from '../../../main/definitions/appRequest';
import { CaseApiResponse, CaseDataCacheKey, CaseType, YesOrNo } from '../../../main/definitions/case';
import { CaseState } from '../../../main/definitions/definition';
import { fromApiFormat, toApiFormat } from '../../../main/helper/ApiFormatter';
import { mockEt1DataModel } from '../mocks/mockEt1DataModel';

describe('Should return data in api format', () => {
  it('should tranform triage and Idam credentials to api format', () => {
    const userDataMap: Map<CaseDataCacheKey, string> = new Map<CaseDataCacheKey, string>([
      [CaseDataCacheKey.CLAIMANT_REPRESENTED, 'Yes'],
      [CaseDataCacheKey.CASE_TYPE, 'Single'],
      [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify('discrimination')],
    ]);

    const mockUserDetails: UserDetails = {
      id: '1234',
      givenName: 'Bobby',
      familyName: 'Ryan',
      email: 'bobby@gmail.com',
      accessToken: 'xxxx',
    };
    const apiData = toApiFormat(userDataMap, mockUserDetails);
    expect(apiData).toEqual(mockEt1DataModel);
  });
});

describe('Format Case Data to Frontend Model', () => {
  it('should format Case Api Response`', () => {
    const mockedApiData: CaseApiResponse = {
      id: '1234',
      state: CaseState.DRAFT,
      case_data: {
        caseType: CaseType.SINGLE,
        claimantRepresentedQuestion: YesOrNo.YES,
      },
    };
    const result = fromApiFormat(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      state: CaseState.DRAFT,
      caseType: 'Single',
      claimantRepresentedQuestion: 'Yes',
    });
  });

  it('should return null for empty field`', () => {
    const mockedApiData: CaseApiResponse = {
      id: '1234',
      state: CaseState.DRAFT,
      case_data: {
        claimantRepresentedQuestion: YesOrNo.YES,
      },
    };
    const result = fromApiFormat(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      state: CaseState.DRAFT,
      caseType: undefined,
      claimantRepresentedQuestion: YesOrNo.YES,
    });
  });
});
