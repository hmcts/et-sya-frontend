import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { UserDetails } from '../../../main/definitions/appRequest';
import { CaseDataCacheKey, CaseType, CaseTypeId, CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { CaseState } from '../../../main/definitions/definition';
import { fromApiFormat, toApiFormat, toApiFormatCreate } from '../../../main/helper/ApiFormatter';
import { mockEt1DataModel, mockEt1DataModelUpdate } from '../mocks/mockEt1DataModel';

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
    const apiData = toApiFormatCreate(userDataMap, mockUserDetails);
    expect(apiData).toEqual(mockEt1DataModel);
  });

  it('should transform case date to api format', () => {
    const caseItem: CaseWithId = {
      id: '1234',
      caseTypeId: CaseTypeId.ENGLAND_WALES,
      caseType: CaseType.SINGLE,
      claimantRepresentedQuestion: YesOrNo.YES,
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      dobDate: {
        year: '2010',
        month: '05',
        day: '11',
      },
      email: 'tester@test.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    const apiData = toApiFormat(caseItem);
    expect(apiData).toEqual(mockEt1DataModelUpdate);
  });
});

describe('Format Case Data to Frontend Model', () => {
  it('should format Case Api Response`', () => {
    const mockedApiData: CaseApiDataResponse = {
      id: '1234',
      case_type_id: CaseTypeId.ENGLAND_WALES,
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      case_data: {
        caseType: CaseType.SINGLE,
        claimantRepresentedQuestion: YesOrNo.YES,
        claimantIndType: {
          claimant_first_names: 'Jane',
          claimant_last_name: 'Doe',
          claimant_date_of_birth: '2022-10-05',
        },
        claimantType: {
          claimant_email_address: 'janedoe@exmaple.com',
        },
      },
    };
    const result = fromApiFormat(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      dobDate: {
        day: '05',
        month: '10',
        year: '2022',
      },
      email: 'janedoe@exmaple.com',
      firstName: 'Jane',
      lastName: 'Doe',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      caseType: 'Single',
      caseTypeId: CaseTypeId.ENGLAND_WALES,
      claimantRepresentedQuestion: 'Yes',
    });
  });

  it('should return undefined for empty field`', () => {
    const mockedApiData: CaseApiDataResponse = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      case_data: {
        claimantRepresentedQuestion: YesOrNo.YES,
      },
    };
    const result = fromApiFormat(mockedApiData);
    expect(result).toStrictEqual({
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      caseType: undefined,
      caseTypeId: undefined,
      claimantRepresentedQuestion: YesOrNo.YES,
      dobDate: undefined,
      email: undefined,
      firstName: undefined,
      lastName: undefined,
    });
  });
});
