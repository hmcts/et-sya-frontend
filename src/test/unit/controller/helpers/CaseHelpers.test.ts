import { nextTick } from 'process';

import axios, { AxiosResponse } from 'axios';

import {
  getSectionStatus,
  getSectionStatusForEmployment,
  handleUpdateDraftCase,
  handleUpdateHubLinksStatuses,
  handleUploadDocument,
  isPostcodeInScope,
  setUserCaseWithRedisData,
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
      expected: sectionStatus.inProgress,
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
      expected: sectionStatus.inProgress,
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

describe('isPostcodeMVPLocation()', () => {
  it.each([
    { postcode: 'G22 6LZ', expected: true }, // Glasgow
    { postcode: 'G32 7RH', expected: true }, // Glasgow
    { postcode: 'G20 9TA', expected: true }, // Glasgow
    { postcode: 'LS9 8FF', expected: true }, // Leeds
    { postcode: 'LS146AD', expected: true }, // Leeds
    { postcode: 'LS124AT', expected: true }, // Leeds
    { postcode: 'EH12 9FZ', expected: true }, // Edinburgh
    { postcode: 'EH12 8XL', expected: true },
    { postcode: 'TD1 1AA', expected: true },
    { postcode: 'TD1 1AB', expected: true },
    { postcode: 'TD1 1AD', expected: true },
    { postcode: 'TD14 5AA', expected: true },
    { postcode: 'ZE1 0AA', expected: true }, //  Lerwick
    { postcode: 'AB1 0AA', expected: true }, // Aberdeen
    { postcode: 'ML1 1AJ', expected: true }, // Motherwell
    { postcode: 'HS1 2AA', expected: true }, // Outer Hebrides
    { postcode: 'HS5 3TT', expected: true },
    { postcode: 'KA1 1AA', expected: true }, // Kilmarnock
    { postcode: 'IV32 7HN', expected: true }, // Inverness
    { postcode: 'OL14 5AA', expected: true }, // Oldham
    { postcode: '1', expected: false },
    { postcode: '2', expected: false },
    { postcode: '100', expected: false },
    { postcode: '', expected: false },
    { postcode: 'TD15 1AA', expected: false },
    { postcode: 'ISE2 0YN', expected: false }, // London
    { postcode: 'W6 9AW', expected: false },
    { postcode: 'SE12 0LJ', expected: false },
    { postcode: 'E4 7AJ', expected: false },
    { postcode: 'E15 1FE', expected: false },
    { postcode: 'N16 6PH', expected: false },
    { postcode: 'E2 6GU', expected: false },
    { postcode: 'W3 7NX', expected: false },
    { postcode: 'E8 1LW', expected: false },
    { postcode: 'E2 6NR', expected: false },
    { postcode: 'LU7 0EU', expected: false }, // Luton
    { postcode: 'LE3 1EP', expected: true }, // Leicester
    { postcode: 'M41 8PX', expected: false }, // Manchester
    { postcode: 'NE289QH', expected: false }, // Newcastle
    { postcode: 'TD12 4AA', expected: false },
    { postcode: 'TD12 4AH', expected: false },
    { postcode: 'OL2 5AA', expected: false },
    { postcode: 'BS1 6JQ', expected: true }, // Bristol
    { postcode: 'BA1 2QH', expected: true }, // Bath
    { postcode: 'EX1 1HS', expected: true }, // Exeter
    { postcode: 'GU35 0PB', expected: true }, // Bordon
    { postcode: 'SO23 8UJ', expected: true }, // Winchester
    { postcode: 'S81 0JG', expected: true }, // Worksop
    { postcode: 'LN6 7QL', expected: true }, // Lincoln
    { postcode: 'PE25 1BJ', expected: true }, // Skegness
  ])('Check if postcode is in scope %o', ({ postcode, expected }) => {
    expect(isPostcodeInScope(postcode)).toEqual(expected);
  });
});

describe('setUserCaseWithRedisData', () => {
  it(
    'should set req.session.userCase when setUserCaseWithRedisData is called with correspondent' +
      'req, and caseData parameters',
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
      'req, and caseData, session.usercase is undefined',
    () => {
      const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
      req.session.userCase = undefined;
      const caseData =
        '[["claimantRepresentedQuestion","No"],["caseType","Multiple"],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

      setUserCaseWithRedisData(req, caseData);

      expect(JSON.stringify(req.session.userCase)).toEqual(
        '{"claimantRepresentedQuestion":"No","caseType":"Multiple","typeOfClaim":["breachOfContract","discrimination","payRelated","unfairDismissal","whistleBlowing"]}'
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

  it('should catch failure whenupdate hub links statuses', async () => {
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
