import axios, { AxiosResponse } from 'axios';
import { Application, NextFunction, Response } from 'express';
import redis from 'redis-mock';

import * as authIndex from '../../../main/auth/index';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { AppRequest, UserDetails } from '../../../main/definitions/appRequest';
import { PageUrls, languages } from '../../../main/definitions/constants';
import { idamCallbackHandler } from '../../../main/modules/oidc';
import * as CacheService from '../../../main/services/CacheService';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCaseApiResponseComplete from '../mocks/mockUserCaseResponseMinimal';

jest.mock('axios');
jest.mock('../../../main/auth/index');

const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
caseApi.createCase = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: mockUserCaseApiResponseComplete,
    status: 200,
  } as AxiosResponse<CaseApiDataResponse>)
);
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

const redisClient = redis.createClient();
const serviceUrl = 'serviceUrl';
const guid = '04a7a170-55aa-4882-8a62-e3c418fa804d';
const existingUser = 'existingUser';
const assignClaimUser = 'assignClaimUser';
const englishGuidParam = '-en';
const welshGuidParam = '-cy';

const caseData =
  '[["claimantRepresentedQuestion","Yes"],["caseType","Single"],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

describe('Test responds to /oauth2/callback', function () {
  let req: AppRequest;
  let res: Response;
  let next: NextFunction;

  beforeAll(() => {
    next = jest.fn();
    req = mockRequest({});
    res = mockResponse();

    req.app = {} as Application;
    req.app.locals = {};
    req.app.locals.redisClient = redisClient;
    req.query = {};

    const getUserDetailsMock = authIndex.getUserDetails as jest.MockedFunction<
      (serviceUrl: string, rawCode: string, callbackUrlPageLink: string) => Promise<UserDetails>
    >;
    getUserDetailsMock.mockReturnValue(Promise.resolve(mockUserDetails as UserDetails));

    jest.spyOn(res, 'redirect');
  });

  afterAll(() => {
    redisClient.quit();
  });

  test('should create a new case in English language and redirect to the new account page in English when a new user logs in', async () => {
    req.query = { code: 'testCode', state: guid + englishGuidParam };
    jest.spyOn(CacheService, 'getPreloginCaseData').mockReturnValue(Promise.resolve(caseData));
    jest.spyOn(authIndex, 'getUserDetails');

    await idamCallbackHandler(req, res, next, serviceUrl).then(() => {
      expect(authIndex.getUserDetails).toHaveBeenCalled();
      expect(CacheService.getPreloginCaseData).toHaveBeenCalled();
      expect(caseApi.createCase).toHaveBeenCalled();
    });
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NEW_ACCOUNT_LANDING + languages.ENGLISH_URL_PARAMETER);
  });

  test('Should redirect to Claimant applications page in English language if an existing user who had selected English logs in', async () => {
    req.query = { code: 'testCode', state: existingUser + englishGuidParam };

    await idamCallbackHandler(req, res, next, serviceUrl);

    expect(res.redirect).toHaveBeenLastCalledWith(PageUrls.CLAIMANT_APPLICATIONS + languages.ENGLISH_URL_PARAMETER);
  });

  test('should create a new case in Welsh language and redirect to the new account page in Welsh when a new user logs in', async () => {
    req.query = { code: 'testCode', state: guid + welshGuidParam };
    jest.spyOn(CacheService, 'getPreloginCaseData').mockReturnValue(Promise.resolve(caseData));
    jest.spyOn(authIndex, 'getUserDetails');

    await idamCallbackHandler(req, res, next, serviceUrl).then(() => {
      expect(authIndex.getUserDetails).toHaveBeenCalled();
      expect(CacheService.getPreloginCaseData).toHaveBeenCalled();
      expect(caseApi.createCase).toHaveBeenCalled();
    });
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NEW_ACCOUNT_LANDING + languages.WELSH_URL_PARAMETER);
  });

  test('Should redirect to Claimant applications page in Welsh language if an existing user who had selected Welsh logs in', async () => {
    req.query = { code: 'testCode', state: existingUser + welshGuidParam };

    await idamCallbackHandler(req, res, next, serviceUrl);

    expect(res.redirect).toHaveBeenLastCalledWith(PageUrls.CLAIMANT_APPLICATIONS + languages.WELSH_URL_PARAMETER);
  });

  test('Should redirect to Your Details Form page in English language when assign claim user logs in', async () => {
    req.query = { code: 'testCode', state: assignClaimUser + englishGuidParam };

    await idamCallbackHandler(req, res, next, serviceUrl);

    expect(res.redirect).toHaveBeenLastCalledWith(PageUrls.YOUR_DETAILS_FORM + languages.ENGLISH_URL_PARAMETER);
  });

  test('Should redirect to Your Details Form page in Welsh language when assign claim user logs in', async () => {
    req.query = { code: 'testCode', state: assignClaimUser + welshGuidParam };

    await idamCallbackHandler(req, res, next, serviceUrl);

    expect(res.redirect).toHaveBeenLastCalledWith(PageUrls.YOUR_DETAILS_FORM + languages.WELSH_URL_PARAMETER);
  });
});
