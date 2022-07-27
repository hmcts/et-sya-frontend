import axios from 'axios';
import config from 'config';

import { UserDetails } from '../../../main/definitions/appRequest';
import {
  CaseType,
  CaseTypeId,
  CaseWithId,
  EmailOrPost,
  HearingPreference,
  PayInterval,
  StillWorking,
  WeeksOrMonths,
  YesOrNo,
  YesOrNoOrNotSure,
} from '../../../main/definitions/case';
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
      isCitizen: true,
    };
    const caseData =
      '[["claimantRepresentedQuestion","Yes"],["caseType","Single"], ["typesOfClaim", "[\\"discrimination\\"]"]]';
    api.createCase(caseData, mockUserDetails);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      JavaApiUrls.INITIATE_CASE_DRAFT,
      expect.objectContaining({
        post_code: 'SW1A 1AA',
        case_data: {
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
        },
      })
    );
  });
});

describe('Axios get to retreive draft cases', () => {
  it('should send get request to the correct api endpoint and return an array of draft cases', async () => {
    api.getDraftCases();

    expect(mockedAxios.get).toHaveBeenCalledWith('cases/user-cases');
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
  it('should update draft case data', async () => {
    const caseItem: CaseWithId = {
      id: '1234',
      caseType: CaseType.SINGLE,
      caseTypeId: CaseTypeId.ENGLAND_WALES,
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
      avgWeeklyHrs: 5,
      claimantPensionContribution: YesOrNoOrNotSure.YES,
      claimantPensionWeeklyContribution: 15,
      employeeBenefits: YesOrNo.YES,
      jobTitle: 'Developer',
      noticePeriod: YesOrNo.YES,
      noticePeriodLength: '1',
      noticePeriodUnit: WeeksOrMonths.WEEKS,
      payBeforeTax: 123,
      payAfterTax: 120,
      payInterval: PayInterval.WEEKLY,
      startDate: { year: '2010', month: '05', day: '11' },
      benefitsCharCount: 'Some benefits',
      pastEmployer: YesOrNo.YES,
      isStillWorking: StillWorking.WORKING,
      personalDetailsCheck: YesOrNo.YES,
      reasonableAdjustments: YesOrNo.YES,
      reasonableAdjustmentsDetail: 'Adjustments detail test',
      hearing_preferences: [HearingPreference.PHONE],
      hearing_assistance: 'Hearing assistance test',
      claimant_contact_preference: EmailOrPost.EMAIL,
      noticeEnds: { year: '2022', month: '08', day: '11' },
    };
    api.updateDraftCase(caseItem);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      JavaApiUrls.UPDATE_CASE_DRAFT,
      expect.objectContaining(mockEt1DataModelUpdate)
    );
  });
});

describe('Axios post to retrieve pdf', () => {
  it('should send post request to the correct api endpoint with the case id passed in the request body', async () => {
    const mockUserDetails: UserDetails = {
      id: '1234',
      givenName: 'Bobby',
      familyName: 'Ryan',
      email: 'bobby@gmail.com',
      accessToken: 'xxxx',
      isCitizen: true,
    };

    api.downloadClaimPdf(mockUserDetails.id);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      JavaApiUrls.DOWNLOAD_CLAIM_PDF,
      expect.objectContaining({
        caseId: '1234',
      }),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/pdf' }),
        responseType: 'arraybuffer',
      })
    );
  });
});
