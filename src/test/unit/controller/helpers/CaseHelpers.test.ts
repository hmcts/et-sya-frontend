import { nextTick } from 'process';

import axios, { AxiosResponse } from 'axios';

import {
  getSectionStatus,
  getSectionStatusForEmployment,
  handleUpdateDraftCase,
  handleUpdateHubLinksStatuses,
  handleUploadDocument,
  respondToApplication,
  setUserCaseWithRedisData,
  submitClaimantTse,
  updateSendNotificationState,
} from '../../../../main/controllers/helpers/CaseHelpers';
import { CaseApiDataResponse } from '../../../../main/definitions/api/caseApiResponse';
import { DocumentUploadResponse } from '../../../../main/definitions/api/documentApiResponse';
import { StillWorking, YesOrNo } from '../../../../main/definitions/case';
import { CaseState, sectionStatus } from '../../../../main/definitions/definition';
import * as CaseService from '../../../../main/services/CaseService';
import { CaseApi } from '../../../../main/services/CaseService';
import { mockSession } from '../../mocks/mockApp';
import { mockFile } from '../../mocks/mockFile';
import { mockLogger } from '../../mocks/mockLogger';
import { mockRequest } from '../../mocks/mockRequest';

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
  it('should successfully save case draft', () => {
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
    handleUpdateDraftCase(req, mockLogger);
    expect(req.session.userCase).toBeDefined();
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

describe('add response to send notification', () => {
  it('should successfully submit response to send notification', () => {
    caseApi.addResponseSendNotification = jest.fn().mockResolvedValueOnce(
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
});
