import axios from 'axios';
import config from 'config';

import { UserDetails } from '../../../main/definitions/appRequest';
import { CaseType, CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { CcdDataModel, JavaApiUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';
import { mockEt1DataModelUpdate } from '../mocks/mockEt1DataModel';

jest.mock('config');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const token = 'testToken';

const api = new CaseApi(mockedAxios);

describe('Axios post to iniate case', () => {
  it('should send post request to the correct api endpoint with the case type passed', async () => {
    const mockUserDetails: UserDetails = {
      id: '1234',
      givenName: 'Bobby',
      familyName: 'Ryan',
      email: 'bobby@gmail.com',
      accessToken: 'xxxx',
    };
    const caseData =
      '[["claimantRepresentedQuestion","Yes"],["caseType","Single"], ["typesOfClaim", "[\\"discrimination\\"]"]]';
    api.createCase(caseData, mockUserDetails);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      JavaApiUrls.INITIATE_CASE_DRAFT,
      expect.objectContaining({
        caseSource: CcdDataModel.CASE_SOURCE,
        caseType: 'Single',
        claimantRepresentedQuestion: 'Yes',
        claimantIndType: {
          claimant_first_names: 'Bobby',
          claimant_last_name: 'Ryan',
        },
        claimantType: {
          claimant_email_address: 'bobby@gmail.com',
        },
      })
    );
  });
});

describe('Axios get to retreive draft cases', () => {
  it('should send get request to the correct api endpoint and return an array of draft cases', async () => {
    api.getDraftCases();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/caseTypes/ET_EnglandWales/cases',
      expect.objectContaining({
        data: {
          match: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
        },
      })
    );
  });
});

describe('getCaseApi', () => {
  beforeAll(() => {
    config.get('services.etSyaApi.host');
    return 'http://randomurl';
  });
  test('should create a CaseApi', () => {
    expect(getCaseApi(token)).toBeInstanceOf(CaseApi);
  });
});

describe('updateDraftCase', () => {
  it('should update draft case data', () => {
    const caseItem: CaseWithId = {
      id: '1234',
      caseType: CaseType.SINGLE,
      claimantRepresentedQuestion: YesOrNo.YES,
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      dobDate: {
        year: '2010',
        month: '05',
        day: '11',
      },
    };
    api.updateDraftCase(caseItem);
    const id = '1234';
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${JavaApiUrls.UPDATE_CASE_DRAFT}/${id}`,
      expect.objectContaining(mockEt1DataModelUpdate)
    );
  });
});
