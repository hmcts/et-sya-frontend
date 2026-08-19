import { nextTick } from 'process';

import axios, { AxiosResponse } from 'axios';

import { Form } from '../../../../main/components/form/form';
import {
  addResponseSendNotification,
  clearBundlesFields,
  clearPrepareDocumentsForHearingFields,
  clearTseFields,
  convertJsonArrayToTitleCase,
  deleteDraftCase,
  getSectionStatus,
  getSectionStatusForEmployment,
  handlePostLogic,
  handlePostLogicPreLogin,
  handleUpdateDraftCase,
  handleUpdateHubLinksStatuses,
  handleUpdateSubmittedCaseFlags,
  handleUploadDocument,
  respondToApplication,
  setUserCase,
  setUserCaseWithRedisData,
  submitBundlesHearingDocs,
  submitClaimantTse,
  updateDecisionState,
  updateJudgmentNotificationState,
  updateSendNotificationState,
} from '../../../../main/controllers/helpers/CaseHelpers';
import { CaseApiDataResponse } from '../../../../main/definitions/api/caseApiResponse';
import { DocumentUploadResponse } from '../../../../main/definitions/api/documentApiResponse';
import { StillWorking, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, languages } from '../../../../main/definitions/constants';
import { CaseState, sectionStatus } from '../../../../main/definitions/definition';
import { HubLinkStatus } from '../../../../main/definitions/hub';
import * as CaseService from '../../../../main/services/CaseService';
import { CaseApi } from '../../../../main/services/CaseService';
import { mockSession } from '../../mocks/mockApp';
import { mockFile } from '../../mocks/mockFile';
import { mockLogger } from '../../mocks/mockLogger';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
caseApi.getUserCase = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: {
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
    },
  } as AxiosResponse<CaseApiDataResponse>)
);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');

mockClient.mockReturnValue(caseApi);

const validCaseApiResponse = {
  data: {
    created_date: '2022-08-19T09:19:25.79202',
    id: '1234',
    last_modified: '2022-08-19T09:19:25.817549',
    state: CaseState.DRAFT,
    case_data: {},
  },
} as AxiosResponse<CaseApiDataResponse>;

const validForm = {
  getFormFields: jest.fn().mockReturnValue({ answer: { type: 'text' } }),
  getParsedBody: jest.fn().mockReturnValue({ answer: 'value' }),
  getValidatorErrors: jest.fn().mockReturnValue([]),
} as unknown as Form;

const invalidForm = {
  getFormFields: jest.fn().mockReturnValue({ answer: { type: 'text' } }),
  getParsedBody: jest.fn().mockReturnValue({ answer: '' }),
  getValidatorErrors: jest.fn().mockReturnValue([{ propertyName: 'answer', errorType: 'required' }]),
} as unknown as Form;

describe('setUserCase', () => {
  it('should create a user case when none exists before assigning form data', () => {
    const req = mockRequest({ body: { answer: 'value' }, session: mockSession([], [], []) });
    req.session.userCase = undefined;

    setUserCase(req, validForm);

    expect(req.session.userCase).toEqual({ answer: 'value' });
  });
});

describe('getSectionStatus()', () => {
  it.each([
    {
      detailsCheckValue: YesOrNo.YES,
      sessionValue: undefined,
      expected: sectionStatus.completed,
    },
    {
      detailsCheckValue: YesOrNo.NO,
      sessionValue: undefined,
      expected: sectionStatus.notStarted,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: undefined,
      expected: sectionStatus.notStarted,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 'a string',
      expected: sectionStatus.inProgress,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 0,
      expected: sectionStatus.notStarted,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 1,
      expected: sectionStatus.inProgress,
    },
  ])('checks section status for task list page when %o', ({ detailsCheckValue, sessionValue, expected }) => {
    const providedStatus = getSectionStatus(detailsCheckValue, sessionValue);
    expect(providedStatus).toStrictEqual(expected);
  });
});

describe('getSectionStatusForEmployment()', () => {
  it.each([
    {
      detailsCheckValue: YesOrNo.YES,
      sessionValue: undefined,
      expected: sectionStatus.completed,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 'a string',
      typesOfClaim: ['payRelated'],
      expected: sectionStatus.inProgress,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 1,
      typesOfClaim: ['unfairDismissal'],
      isStillWorking: StillWorking.WORKING,
      expected: sectionStatus.inProgress,
    },
    {
      detailsCheckValue: YesOrNo.NO,
      sessionValue: undefined,
      expected: sectionStatus.notStarted,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: undefined,
      typesOfClaim: ['unfairDismissal', 'payRelated'],
      expected: sectionStatus.notStarted,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 0,
      expected: sectionStatus.notStarted,
    },
  ])(
    'checks section status for employment section when %o',
    ({ detailsCheckValue, sessionValue, typesOfClaim, isStillWorking, expected }) => {
      const providedStatus = getSectionStatusForEmployment(
        detailsCheckValue,
        sessionValue,
        typesOfClaim,
        isStillWorking
      );
      expect(providedStatus).toStrictEqual(expected);
    }
  );
});

describe('setUserCaseWithRedisData', () => {
  it(
    'should set req.session.userCase when setUserCaseWithRedisData is called with correspondent' +
      'req, and caseData parameters with caseType of Multiple',
    () => {
      const req = mockRequest({ session: mockSession([], [], []) });
      const caseData =
        '[["claimantRepresentedQuestion","No"],["caseType","Multiple"],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

      setUserCaseWithRedisData(req, caseData);

      expect(JSON.stringify(req.session.userCase)).toEqual(
        '{"id":"testUserCaseId","state":"AWAITING_SUBMISSION_TO_HMCTS","typeOfClaim":["breachOfContract","discrimination","payRelated","unfairDismissal","whistleBlowing"],"tellUsWhatYouWant":[],"createdDate":"August 19, 2022","lastModified":"August 19, 2022","claimantRepresentedQuestion":"No","caseType":"Multiple"}'
      );
    }
  );
  it(
    'should set req.session.userCase when setUserCaseWithRedisData is called with correspondent' +
      'req, and caseData parameters with caseType of null, meaning it defaults to Single',
    () => {
      const req = mockRequest({ session: mockSession([], [], []) });
      const caseData =
        '[["claimantRepresentedQuestion","No"],["caseType",""],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

      setUserCaseWithRedisData(req, caseData);

      expect(JSON.stringify(req.session.userCase)).toEqual(
        '{"id":"testUserCaseId","state":"AWAITING_SUBMISSION_TO_HMCTS","typeOfClaim":["breachOfContract","discrimination","payRelated","unfairDismissal","whistleBlowing"],"tellUsWhatYouWant":[],"createdDate":"August 19, 2022","lastModified":"August 19, 2022","claimantRepresentedQuestion":"No","caseType":"Single"}'
      );
    }
  );
  it(
    'should set req.session.userCase when setUserCaseWithRedisData is called with correspondent' +
      'req, and caseData, session.usercase is undefined',
    () => {
      const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
      req.session.userCase = undefined;
      const caseData =
        '[["claimantRepresentedQuestion","No"],["caseType","Single"],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

      setUserCaseWithRedisData(req, caseData);

      expect(JSON.stringify(req.session.userCase)).toEqual(
        '{"claimantRepresentedQuestion":"No","caseType":"Single","typeOfClaim":["breachOfContract","discrimination","payRelated","unfairDismissal","whistleBlowing"]}'
      );
    }
  );
});

describe('handle update draft case', () => {
  it('should successfully save case draft', async () => {
    caseApi.updateDraftCase = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.DRAFT,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    await handleUpdateDraftCase(req, mockLogger);
    expect(req.session.userCase).toBeDefined();
  });

  it('should store a safe return url and language-specific error when saving a Welsh draft fails', async () => {
    jest.clearAllMocks();
    caseApi.updateDraftCase = jest.fn().mockRejectedValueOnce(new Error('draft update failed'));
    const req = mockRequest({ session: mockSession([], [], []) });
    req.url = PageUrls.YOUR_SUPPORT + languages.WELSH_URL_PARAMETER + '&unsafe=http://dodgy.test';

    await handleUpdateDraftCase(req, mockLogger);

    expect(req.session.userCase.updateDraftCaseError).toBe(
      "Mae gwall wrth ddiweddaru eich achos. Cliciwch y neges gwall hon i fynd yn ôl i'r camau i wneud eich cais ac ailgyflwyno'r manylion."
    );
    expect(req.session.returnUrl).toBe(PageUrls.YOUR_SUPPORT);
    expect(req.session.save).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith('draft update failed');
  });

  it('should not update the draft case when session errors already exist', async () => {
    caseApi.updateDraftCase = jest.fn();
    const req = mockRequest({ session: mockSession([], [], []) });
    req.session.errors = [{ propertyName: 'field', errorType: 'required' }];

    await handleUpdateDraftCase(req, mockLogger);

    expect(caseApi.updateDraftCase).not.toHaveBeenCalled();
  });
});

describe('handle update submitted case flags', () => {
  it('should update submitted case flags and save the formatted case', async () => {
    caseApi.updateSubmittedCaseFlags = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          id: '1234',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.SUBMITTED,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ session: mockSession([], [], []) });
    const originalUserCase = req.session.userCase;

    await handleUpdateSubmittedCaseFlags(req, mockLogger);

    expect(caseApi.updateSubmittedCaseFlags).toHaveBeenCalledWith(originalUserCase);
    expect(req.session.save).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith('Updated submitted case flags for case id: testUserCaseId');
  });

  it('should log and rethrow submitted case flag update failures', async () => {
    const error = new Error('submitted flag update failed');
    caseApi.updateSubmittedCaseFlags = jest.fn().mockRejectedValueOnce(error);
    const req = mockRequest({ session: mockSession([], [], []) });

    await expect(handleUpdateSubmittedCaseFlags(req, mockLogger)).rejects.toThrow(error);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to update submitted case flags testUserCaseId: submitted flag update failed'
    );
  });
});

describe('handlePostLogicPreLogin', () => {
  it.each([
    {
      expectedLang: languages.WELSH,
      expectedRedirect: PageUrls.SINGLE_OR_MULTIPLE_CLAIM + languages.WELSH_URL_PARAMETER,
      url: PageUrls.LIP_OR_REPRESENTATIVE + languages.WELSH_URL_PARAMETER,
    },
    {
      expectedLang: languages.ENGLISH,
      expectedRedirect: PageUrls.SINGLE_OR_MULTIPLE_CLAIM + languages.ENGLISH_URL_PARAMETER,
      url: PageUrls.LIP_OR_REPRESENTATIVE + languages.ENGLISH_URL_PARAMETER,
    },
    {
      expectedLang: languages.ENGLISH,
      expectedRedirect: PageUrls.SINGLE_OR_MULTIPLE_CLAIM,
      url: PageUrls.LIP_OR_REPRESENTATIVE,
    },
  ])('should redirect with a safe language parameter for %o', ({ expectedLang, expectedRedirect, url }) => {
    const req = mockRequest({ body: { answer: 'value' }, session: mockSession([], [], []) });
    req.url = url;
    const res = mockResponse();

    handlePostLogicPreLogin(req, res, validForm, PageUrls.SINGLE_OR_MULTIPLE_CLAIM);

    expect(req.session.lang).toBe(expectedLang);
    expect(req.session.errors).toEqual([]);
    expect(res.redirect).toHaveBeenCalledWith(expectedRedirect);
  });

  it('should keep users on the current page when pre-login validation fails', () => {
    const req = mockRequest({ body: { answer: '' }, session: mockSession([], [], []) });
    req.url = PageUrls.LIP_OR_REPRESENTATIVE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();

    handlePostLogicPreLogin(req, res, invalidForm, PageUrls.SINGLE_OR_MULTIPLE_CLAIM);

    expect(req.session.errors).toEqual([{ propertyName: 'answer', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(req.url);
  });
});

describe('postLogic', () => {
  beforeEach(() => {
    caseApi.updateDraftCase = jest.fn().mockResolvedValue(validCaseApiResponse);
  });

  it('should redirect to the save draft page with a safe language parameter', async () => {
    const req = mockRequest({
      body: { answer: 'value', saveForLater: 'true' },
      session: mockSession([], [], []),
    });
    req.url = PageUrls.YOUR_SUPPORT + languages.WELSH_URL_PARAMETER;
    const res = mockResponse();

    await handlePostLogic(req, res, validForm, mockLogger, PageUrls.CHECK_ANSWERS);

    expect(req.session.lang).toBe(languages.WELSH);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED + languages.WELSH_URL_PARAMETER);
  });

  it('should redirect directly to the next page when requested', async () => {
    const req = mockRequest({ body: { answer: 'value' }, session: mockSession([], [], []) });
    req.url = PageUrls.YOUR_SUPPORT + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();

    await handlePostLogic(req, res, validForm, mockLogger, PageUrls.CHECK_ANSWERS, true);

    expect(req.session.lang).toBe(languages.ENGLISH);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS + languages.ENGLISH_URL_PARAMETER);
  });

  it('should keep users on the current page when validation fails', async () => {
    caseApi.updateDraftCase = jest.fn();
    const req = mockRequest({ body: { answer: '' }, session: mockSession([], [], []) });
    req.url = PageUrls.YOUR_SUPPORT + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();

    await handlePostLogic(req, res, invalidForm, mockLogger, PageUrls.CHECK_ANSWERS);

    expect(caseApi.updateDraftCase).not.toHaveBeenCalled();
    expect(req.session.errors).toEqual([{ propertyName: 'answer', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(req.url);
  });
});

describe('handle submit application', () => {
  it('should successfully submit application', () => {
    caseApi.submitClaimantTse = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.SUBMITTED,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    submitClaimantTse(req, mockLogger);
    expect(req.session.userCase).toBeDefined();
  });

  it('should catch failure to submit application', async () => {
    const errorMessage = 'test error';
    const testError = new Error(errorMessage);

    caseApi.submitClaimantTse = jest.fn().mockRejectedValueOnce(testError);

    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    await expect(submitClaimantTse(req, mockLogger)).rejects.toThrow(testError);

    expect(mockLogger.error).toHaveBeenCalledWith(errorMessage);
  });
});

describe('handle submit bundles hearing documents', () => {
  it('should successfully submit bundles hearing documents', async () => {
    caseApi.submitBundlesHearingDoc = jest.fn().mockResolvedValueOnce(undefined);
    const req = mockRequest({ session: mockSession([], [], []) });

    await submitBundlesHearingDocs(req, mockLogger);

    expect(caseApi.submitBundlesHearingDoc).toHaveBeenCalledWith(req.session.userCase);
    expect(mockLogger.info).toHaveBeenCalledWith('Submitted bundles hearing doc info for case: testUserCaseId');
  });

  it('should log and rethrow bundle submission failures', async () => {
    const error = new Error('bundle submit failed');
    caseApi.submitBundlesHearingDoc = jest.fn().mockRejectedValueOnce(error);
    const req = mockRequest({ session: mockSession([], [], []) });

    await expect(submitBundlesHearingDocs(req, mockLogger)).rejects.toThrow(error);

    expect(mockLogger.error).toHaveBeenCalledWith('bundle submit failed');
  });
});

describe('handle update hub links statuses', () => {
  it('should successfully update hub links statuses', async () => {
    caseApi.updateHubLinksStatuses = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.DRAFT,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    handleUpdateHubLinksStatuses(req, mockLogger);
    await new Promise(nextTick);
    expect(mockLogger.info).toHaveBeenCalledWith('Updated hub links statuses for case: testUserCaseId');
  });

  it('should catch failure when update hub links statuses', async () => {
    caseApi.updateHubLinksStatuses = jest.fn().mockRejectedValueOnce({ message: 'test error' });

    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    handleUpdateHubLinksStatuses(req, mockLogger);
    await new Promise(nextTick);

    expect(mockLogger.error).toHaveBeenCalledWith('test error');
  });
});

describe('handle file upload', () => {
  it('should succesfully handle file upload', async () => {
    caseApi.uploadDocument = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          _links: {
            self: {
              href: 'test.pdf',
            },
          },
        },
      } as AxiosResponse<DocumentUploadResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    handleUploadDocument(req, mockFile, mockLogger);
    await new Promise(nextTick);
    expect(mockLogger.info).toHaveBeenCalledWith('Uploaded document to: test.pdf');
  });

  it('should log upload failures', async () => {
    caseApi.uploadDocument = jest.fn().mockRejectedValueOnce(new Error('upload failed'));
    const req = mockRequest({ session: mockSession([], [], []) });

    await handleUploadDocument(req, mockFile, mockLogger);

    expect(mockLogger.error).toHaveBeenCalledWith('upload failed');
  });
});

describe('handle respond to application', () => {
  it('should successfully submit respond to application', () => {
    caseApi.respondToApplication = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.SUBMITTED,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    respondToApplication(req, mockLogger);
    expect(req.session.userCase).toBeDefined();
  });

  it('should log and rethrow response submission failures', async () => {
    const error = new Error('respond failed');
    caseApi.respondToApplication = jest.fn().mockRejectedValueOnce(error);
    const req = mockRequest({ session: mockSession([], [], []) });

    await expect(respondToApplication(req, mockLogger)).rejects.toThrow(error);

    expect(mockLogger.error).toHaveBeenCalledWith('respond failed');
  });
});

describe('update sendNotification state', () => {
  it('should successfully update sendNotification state', () => {
    caseApi.updateSendNotificationState = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.SUBMITTED,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    updateSendNotificationState(req, mockLogger);
    expect(req.session.userCase).toBeDefined();
  });

  it('should catch failure when update sendNotification state', async () => {
    caseApi.updateSendNotificationState = jest.fn().mockRejectedValueOnce({ message: 'test error' });

    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    updateSendNotificationState(req, mockLogger);
    await new Promise(nextTick);
    expect(mockLogger.error).toHaveBeenCalledWith('test error');
  });
});

describe('update judgment notification state', () => {
  it('should mark the selected judgment as viewed', async () => {
    caseApi.updateJudgmentNotificationState = jest.fn().mockResolvedValueOnce(undefined);
    const selectedJudgment = {
      id: 'selected-judgment-id',
      value: {
        number: '1',
      },
    } as any;
    const req = mockRequest({ session: mockSession([], [], []) });
    req.session.userCase.sendNotificationCollection = [{ id: 'judgment-notification-id' }] as any;

    await updateJudgmentNotificationState(selectedJudgment, req, mockLogger);

    expect(selectedJudgment.value.notificationState).toBe(HubLinkStatus.VIEWED);
    expect(caseApi.updateJudgmentNotificationState).toHaveBeenCalledWith(selectedJudgment, req.session.userCase);
    expect(mockLogger.info).toHaveBeenCalledWith('Updated state for selected judgment: judgment-notification-id');
  });

  it('should log judgment notification update failures', async () => {
    caseApi.updateJudgmentNotificationState = jest.fn().mockRejectedValueOnce(new Error('judgment update failed'));
    const selectedJudgment = {
      value: {
        number: '1',
      },
    } as any;
    const req = mockRequest({ session: mockSession([], [], []) });

    await updateJudgmentNotificationState(selectedJudgment, req, mockLogger);

    expect(mockLogger.error).toHaveBeenCalledWith('judgment update failed');
  });
});

describe('update decision state', () => {
  it('should mark the selected decision as viewed', async () => {
    caseApi.updateDecisionState = jest.fn().mockResolvedValueOnce(undefined);
    const selectedDecision = {
      id: 'decision-id',
      value: {},
    } as any;
    const req = mockRequest({ session: mockSession([], [], []) });

    await updateDecisionState('application-id', selectedDecision, req, mockLogger);

    expect(selectedDecision.value.decisionState).toBe(HubLinkStatus.VIEWED);
    expect(caseApi.updateDecisionState).toHaveBeenCalledWith('application-id', selectedDecision, req.session.userCase);
    expect(mockLogger.info).toHaveBeenCalledWith('Updated state for selected decision: decision-id');
  });

  it('should log decision update failures', async () => {
    caseApi.updateDecisionState = jest.fn().mockRejectedValueOnce(new Error('decision update failed'));
    const selectedDecision = {
      id: 'decision-id',
      value: {},
    } as any;
    const req = mockRequest({ session: mockSession([], [], []) });

    await updateDecisionState('application-id', selectedDecision, req, mockLogger);

    expect(mockLogger.error).toHaveBeenCalledWith('decision update failed');
  });
});

describe('add response to send notification', () => {
  it('should successfully submit response to send notification', async () => {
    caseApi.addResponseSendNotification = jest.fn().mockResolvedValueOnce(undefined);
    const req = mockRequest({ session: mockSession([], [], []) });
    req.session.userCase.selectedRequestOrOrder = { id: 'request-id' } as any;

    await addResponseSendNotification(req, mockLogger);

    expect(caseApi.addResponseSendNotification).toHaveBeenCalledWith(req.session.userCase);
    expect(mockLogger.info).toHaveBeenCalledWith('Responded to sendNotification: request-id');
  });

  it('should log and rethrow response-to-notification failures', async () => {
    const error = new Error('send notification response failed');
    caseApi.addResponseSendNotification = jest.fn().mockRejectedValueOnce(error);
    const req = mockRequest({ session: mockSession([], [], []) });

    await expect(addResponseSendNotification(req, mockLogger)).rejects.toThrow(error);

    expect(mockLogger.error).toHaveBeenCalledWith('send notification response failed');
  });
});

describe('clear helpers', () => {
  it('should clear TSE fields', () => {
    const userCase = {
      contactApplicationFile: { document: 'file' },
      contactApplicationText: 'text',
      copyToOtherPartyText: 'copy',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      hasSupportingMaterial: YesOrNo.YES,
      isRespondingToRequestOrOrder: YesOrNo.YES,
      responseText: 'response',
      selectedRequestOrOrder: { id: 'request-id' },
      storeState: 'stored',
      supportingMaterialFile: { document: 'file' },
    } as any;

    clearTseFields(userCase);

    expect(userCase).toEqual({
      contactApplicationFile: undefined,
      contactApplicationText: undefined,
      copyToOtherPartyText: undefined,
      copyToOtherPartyYesOrNo: undefined,
      hasSupportingMaterial: undefined,
      isRespondingToRequestOrOrder: undefined,
      responseText: undefined,
      selectedRequestOrOrder: undefined,
      storeState: undefined,
      supportingMaterialFile: undefined,
    });
  });

  it('should clear prepare documents fields', () => {
    const userCase = {
      bundlesRespondentAgreedDocWith: YesOrNo.YES,
      bundlesRespondentAgreedDocWithBut: 'some',
      bundlesRespondentAgreedDocWithNo: 'none',
    } as any;

    clearPrepareDocumentsForHearingFields(userCase);

    expect(userCase).toEqual({
      bundlesRespondentAgreedDocWith: undefined,
      bundlesRespondentAgreedDocWithBut: undefined,
      bundlesRespondentAgreedDocWithNo: undefined,
    });
  });

  it('should clear bundle upload fields', () => {
    const userCase = {
      bundlesRespondentAgreedDocWith: YesOrNo.YES,
      bundlesRespondentAgreedDocWithBut: 'some',
      bundlesRespondentAgreedDocWithNo: 'none',
      formattedSelectedHearing: { id: 'hearing-id' },
      hearingDocument: { document: 'file' },
      hearingDocumentsAreFor: 'hearing',
      whatAreTheseDocuments: 'documents',
      whoseHearingDocumentsAreYouUploading: 'claimant',
    } as any;

    clearBundlesFields(userCase);

    expect(userCase).toEqual({
      bundlesRespondentAgreedDocWith: undefined,
      bundlesRespondentAgreedDocWithBut: undefined,
      bundlesRespondentAgreedDocWithNo: undefined,
      formattedSelectedHearing: undefined,
      hearingDocument: undefined,
      hearingDocumentsAreFor: undefined,
      whatAreTheseDocuments: undefined,
      whoseHearingDocumentsAreYouUploading: undefined,
    });
  });
});

describe('convertJsonArrayToTitleCase', () => {
  it('should title-case address fields while preserving postcode values', () => {
    expect(
      convertJsonArrayToTitleCase([
        {
          fullAddress: '10 downing street, SW1A 2AA',
          postcode: 'SW1A 2AA',
          town: 'london',
        },
      ])
    ).toEqual([
      {
        fullAddress: '10 Downing Street, SW1A 2AA',
        postcode: 'SW1A 2AA',
        town: 'London',
      },
    ]);
  });
});

describe('deleteDraftCase', () => {
  it('should delete draft case and log info', async () => {
    const mockDeleteDraftCase = jest.fn().mockResolvedValueOnce(undefined);
    caseApi.deleteDraftCase = mockDeleteDraftCase;
    const req = mockRequest({ session: mockSession([], [], []) });
    req.session.user = {
      accessToken: 'token',
      id: 'userId',
      email: 'user@example.com',
      givenName: 'Test',
      familyName: 'User',
      isCitizen: true,
    };
    req.session.userCase = {
      id: 'caseId',
      state: 'DRAFT',
      createdDate: '2022-01-01',
      lastModified: '2022-01-02',
    } as unknown as import('../../../../main/definitions/case').CaseWithId;
    await deleteDraftCase(req, mockLogger);
    expect(mockDeleteDraftCase).toHaveBeenCalledWith(req.session.userCase);
    expect(mockLogger.info).toHaveBeenCalledWith('Deleted draft case id: caseId');
  });

  it('should log error and throw if delete fails', async () => {
    const error = new Error('delete failed');
    caseApi.deleteDraftCase = jest.fn().mockRejectedValueOnce(error);
    const req = mockRequest({ session: mockSession([], [], []) });
    req.session.user = {
      accessToken: 'token',
      id: 'userId',
      email: 'user@example.com',
      givenName: 'Test',
      familyName: 'User',
      isCitizen: true,
    };
    req.session.userCase = {
      id: 'caseId',
      state: 'DRAFT',
      createdDate: '2022-01-01',
      lastModified: '2022-01-02',
    } as unknown as import('../../../../main/definitions/case').CaseWithId;
    await expect(deleteDraftCase(req, mockLogger)).rejects.toThrow(error);
    expect(mockLogger.error).toHaveBeenCalledWith('delete failed');
  });
});
