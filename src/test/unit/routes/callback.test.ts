import axios, { AxiosResponse } from 'axios';
import { Application, NextFunction, Response } from 'express';
import redis from 'redis-mock';

import * as authIndex from '../../../main/auth/index';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { AppRequest, UserDetails } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { idamCallbackHandler } from '../../../main/modules/oidc';
import * as CacheService from '../../../main/services/CacheService';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('axios');
jest.mock('../../../main/auth/index');

const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
const redisClient = redis.createClient();
const serviceUrl = 'serviceUrl';
const caseType = 'ET_EnglandWales';
const guid = '04a7a170-55aa-4882-8a62-e3c418fa804d';
const existingUser = 'existingUser';

let req: AppRequest;
let res: Response;
let next: NextFunction;

describe('Test responds to /oauth2/callback', function () {
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

  test('Should get user details if both state and code param are found in req.query', () => {
    //Given that both the code and state param exist
    req.query = { code: 'testCode', state: guid };

    const getUserDetailsMock = authIndex.getUserDetails as jest.MockedFunction<
      (serviceUrl: string, rawCode: string, callbackUrlPageLink: string) => Promise<UserDetails>
    >;
    getUserDetailsMock.mockReturnValue(Promise.resolve(mockUserDetails as UserDetails));

    //Then it should call getUserDetails
    jest.spyOn(authIndex, 'getUserDetails');
    return idamCallbackHandler(req, res, next, serviceUrl).then(() =>
      expect(authIndex.getUserDetails).toHaveBeenCalled()
    );
  });

  test('Should get prelogin case data from redis if it is a new user', () => {
    //Given that both the code and state param exist
    req.query = { code: 'testCode', state: guid };

    //Then it should call getPreloginCaseData
    jest.spyOn(CacheService, 'getPreloginCaseData');
    return idamCallbackHandler(req, res, next, serviceUrl).then(() =>
      expect(CacheService.getPreloginCaseData).toHaveBeenCalled()
    );
  });

  test('Should call sya-api to create draft case if prelogin data successfully retreived', () => {
    //Given that both the code and state param exist
    req.query = { code: 'testCode', state: guid };

    //Given that prelogin data is successfully retreived
    jest.spyOn(CacheService, 'getPreloginCaseData').mockReturnValue(Promise.resolve(caseType));

    //Then it should call getCaseApi to create draft case
    jest.spyOn(CaseService, 'getCaseApi');
    return idamCallbackHandler(req, res, next, serviceUrl).then(() =>
      expect(CaseService.getCaseApi).toHaveBeenCalled()
    );
  });

  test('Should redirect to NEW_ACCOUNT_LANDING page if successfully created case', async () => {
    //Given that both the code and state param exist
    req.query = { code: 'testCode', state: guid };

    //Given that prelogin data is successfully retreived
    jest.spyOn(CacheService, 'getPreloginCaseData').mockReturnValue(Promise.resolve(caseType));

    //Given that case is created successfully
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
    caseApi.createCase = jest.fn().mockResolvedValue(
      Promise.resolve({
        data: {
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          last_modified: '2019-02-12T14:25:39.015',
          created_date: '2019-02-12T14:25:39.015',
        },
        status: 200,
      } as AxiosResponse<CaseApiDataResponse>)
    );

    //Then it should redirect to NEW_ACCOUNT_LANDING page
    idamCallbackHandler(req, res, next, serviceUrl);
    await new Promise(process.nextTick);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NEW_ACCOUNT_LANDING);
  });

  test('Should redirect to Claimant applications page if it is a existing user', async () => {
    //Given that the state param is 'existingUser'
    req.query = { code: 'testCode', state: existingUser };

    //Then it should redirect to CLAIM_STEPS page
    idamCallbackHandler(req, res, next, serviceUrl);
    await new Promise(process.nextTick);
    expect(res.redirect).toHaveBeenLastCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });
});
