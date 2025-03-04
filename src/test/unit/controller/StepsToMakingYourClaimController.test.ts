import axios, { AxiosResponse } from 'axios';
import { Application } from 'express';
import redis from 'redis-mock';

import StepsToMakingYourClaimController from '../../../main/controllers/StepsToMakingYourClaimController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseType, YesOrNo } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import { CaseState, TypesOfClaim } from '../../../main/definitions/definition';
import * as cacheService from '../../../main/services/CacheService';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockSession } from '../mocks/mockApp';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const stepsToMakingYourClaimController = new StepsToMakingYourClaimController();
const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');
jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

// All page includes links there is no redirect page that is why did not check
// response.redirect

describe('Steps to Making your claim Controller', () => {
  it('should render single or multiple claim page', () => {
    const response = mockResponse();
    const request = mockRequest({ session: mockSession([TypesOfClaim.DISCRIMINATION], [], []) });
    stepsToMakingYourClaimController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, expect.anything());
  });

  it('should render page with claim type DISCRIMINATION', () => {
    const response = mockResponse();
    const request = mockRequest({ session: mockSession([TypesOfClaim.DISCRIMINATION], [], []) });
    stepsToMakingYourClaimController.get(request, response);
    expect(request.session.userCase.typeOfClaim).toEqual([TypesOfClaim.DISCRIMINATION]);
  });

  it('should render page with claim type UNFAIR_DISMISSAL', () => {
    const response = mockResponse();
    const request = mockRequest({ session: mockSession([TypesOfClaim.UNFAIR_DISMISSAL], [], []) });
    stepsToMakingYourClaimController.get(request, response);
    expect(request.session.userCase.typeOfClaim).toEqual([TypesOfClaim.UNFAIR_DISMISSAL]);
  });

  it('should render page with claim type PAY_RELATED_CLAIM', () => {
    const response = mockResponse();
    const request = mockRequest({ session: mockSession([TypesOfClaim.PAY_RELATED_CLAIM], [], []) });
    stepsToMakingYourClaimController.get(request, response);
    expect(request.session.userCase.typeOfClaim).toEqual([TypesOfClaim.PAY_RELATED_CLAIM]);
  });

  it('should create new case, if no case id exists', async () => {
    const redisClient = redis.createClient();
    const createdCaseResponse: AxiosResponse<CaseApiDataResponse> = {
      data: {
        id: '12234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
        last_modified: '2019-02-12T14:25:39.015',
        created_date: '2019-02-12T14:25:39.015',
        case_data: {
          caseType: CaseType.SINGLE,
          typesOfClaim: ['discrimination', 'payRelated'],
          claimantRepresentedQuestion: YesOrNo.YES,
          caseSource: 'ET1 Online',
        },
      },
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };
    const res = mockResponse();
    const req = mockRequestEmpty({});
    req.url = '/testPageUrl?lng=cy';
    req.session.userCase.id = undefined;
    req.app = {} as Application;
    req.app.locals = {};
    req.app.locals.redisClient = redisClient;
    req.session.guid = '04a7a170-55aa-4882-8a62-e3c418fa804d';
    jest
      .spyOn(cacheService, 'getPreloginCaseData')
      .mockResolvedValue(
        '[["claimantRepresentedQuestion","Yes"],["caseType","Single"],["typeOfClaim","[\\"discrimination\\",\\"payRelated\\"]"]]'
      );
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.createCase = jest.fn().mockResolvedValue(createdCaseResponse);

    await stepsToMakingYourClaimController.get(req, res);

    expect(req.session.userCase).toEqual({
      id: '12234',
      createdDate: '12 February 2019',
      lastModified: '12 February 2019',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      caseType: CaseType.SINGLE,
      caseTypeId: undefined,
      claimantRepresentedQuestion: YesOrNo.YES,
      typeOfClaim: [TypesOfClaim.DISCRIMINATION, TypesOfClaim.PAY_RELATED_CLAIM],
      dobDate: undefined,
      claimantSex: undefined,
      claimantGenderIdentitySame: undefined,
      claimantGenderIdentity: undefined,
      preferredTitle: undefined,
      otherTitlePreference: undefined,
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      claimantPensionContribution: undefined,
      claimantPensionWeeklyContribution: undefined,
      employeeBenefits: undefined,
      endDate: undefined,
      newJob: undefined,
      newJobPay: undefined,
      newJobPayInterval: undefined,
      newJobStartDate: undefined,
      avgWeeklyHrs: undefined,
      jobTitle: undefined,
      noticePeriod: undefined,
      noticePeriodLength: undefined,
      noticePeriodUnit: undefined,
      payAfterTax: undefined,
      payBeforeTax: undefined,
      payInterval: undefined,
      startDate: undefined,
      benefitsCharCount: undefined,
      isStillWorking: undefined,
      pastEmployer: undefined,
      personalDetailsCheck: undefined,
      reasonableAdjustments: undefined,
      reasonableAdjustmentsDetail: undefined,
      rejectionOfClaimDocumentDetail: undefined,
      respondentResponseDeadline: undefined,
      responseAcknowledgementDocumentDetail: undefined,
      responseEt3FormDocumentDetail: [],
      responseRejectionDocumentDetail: undefined,
      telNumber: undefined,
      noticeEnds: undefined,
      hearingPreferences: undefined,
      hearingPanelPreference: undefined,
      hearingPanelPreferenceReasonJudge: '',
      hearingPanelPreferenceReasonPanel: '',
      hearingAssistance: undefined,
      claimantContactPreference: undefined,
      claimantContactLanguagePreference: undefined,
      claimantHearingLanguagePreference: undefined,
      employmentAndRespondentCheck: undefined,
      claimDetailsCheck: undefined,
      respondents: undefined,
      otherClaim: undefined,
      ClaimantPcqId: undefined,
      acknowledgementOfClaimLetterDetail: undefined,
      address1: undefined,
      address2: undefined,
      addressCountry: undefined,
      addressPostcode: undefined,
      addressTown: undefined,
      claimSummaryFile: undefined,
      claimSummaryText: undefined,
      claimTypeDiscrimination: undefined,
      claimTypePay: undefined,
      claimantWorkAddressQuestion: undefined,
      compensationAmount: undefined,
      compensationOutcome: undefined,
      et1SubmittedForm: undefined,
      et3ResponseReceived: false,
      ethosCaseReference: undefined,
      feeGroupReference: undefined,
      hubLinksStatuses: undefined,
      managingOffice: undefined,
      submittedDate: undefined,
      tellUsWhatYouWant: undefined,
      tribunalCorrespondenceEmail: undefined,
      tribunalCorrespondenceTelephone: undefined,
      tribunalRecommendationRequest: undefined,
      whistleblowingClaim: undefined,
      whistleblowingEntityName: undefined,
      linkedCases: undefined,
      linkedCasesDetail: undefined,
      workAddress1: undefined,
      workAddress2: undefined,
      workAddressCountry: undefined,
      workAddressPostcode: undefined,
      workAddressTown: undefined,
      bundleDocuments: [],
    });
    redisClient.quit();
  });

  it('should render page with all claim types', () => {
    const response = mockResponse();
    const request = mockRequest({
      session: mockSession(
        [
          TypesOfClaim.PAY_RELATED_CLAIM,
          TypesOfClaim.DISCRIMINATION,
          TypesOfClaim.BREACH_OF_CONTRACT,
          TypesOfClaim.UNFAIR_DISMISSAL,
          TypesOfClaim.WHISTLE_BLOWING,
          TypesOfClaim.OTHER_TYPES,
        ],
        [],
        []
      ),
    });
    stepsToMakingYourClaimController.get(request, response);
    expect(request.session.userCase.typeOfClaim).toEqual([
      TypesOfClaim.PAY_RELATED_CLAIM,
      TypesOfClaim.DISCRIMINATION,
      TypesOfClaim.BREACH_OF_CONTRACT,
      TypesOfClaim.UNFAIR_DISMISSAL,
      TypesOfClaim.WHISTLE_BLOWING,
      TypesOfClaim.OTHER_TYPES,
    ]);
  });
});
