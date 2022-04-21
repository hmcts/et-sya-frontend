import axios from 'axios';
import config from 'config';

import { UserDetails } from '../../../main/definitions/appRequest';
import { CcdDataModel, JavaApiUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';

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
        claimantRespresentedQuestion: 'Yes',
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
