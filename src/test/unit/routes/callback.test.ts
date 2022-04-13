// import { CaseWithId } from "../../../main/definitions/case";
import axios from 'axios';
import { Application, NextFunction, Response } from 'express';
import redis, { RedisClient } from 'redis-mock';

import * as authIndex from '../../../main/auth/index';
import { AppRequest, UserDetails } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
import { idamCallbackHandler } from '../../../main/modules/oidc/index';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi, CaseDraftResponse } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

// import { AppSession, UserDetails } from "../../../main/definitions/appRequest";

jest.mock('axios');
jest.mock('../../../main/auth/index');

const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
const redisClient = redis.createClient();
const serviceUrl = 'serviceUrl';
const caseType = 'ET_EnglandWales';
const guid = '04a7a170-55aa-4882-8a62-e3c418fa804d';

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
    getUserDetailsMock.mockReturnValue(Promise.resolve({} as UserDetails));

    jest.spyOn(res, 'redirect');
    jest.spyOn(authIndex, 'getUserDetails');
    jest.spyOn(CaseService, 'getPreloginCaseData');
    jest.spyOn(CaseService, 'getCaseApi');
  });

  test('Should get user details if both state and code param are found in req.query', () => {
    req.query = { code: 'testCode', state: guid };
    return idamCallbackHandler(req, res, next, serviceUrl).then(() =>
      expect(authIndex.getUserDetails).toHaveBeenCalled()
    );
  });

  test('Should get prelogin case data from redis if it is a new user', () => {
    req.query = { code: 'testCode', state: guid };
    return idamCallbackHandler(req, res, next, serviceUrl).then(() =>
      expect(CaseService.getPreloginCaseData).toHaveBeenCalled()
    );
  });

  test('Should call sya-api to create draft case if prelogin data successfully retreived', () => {
    req.query = { code: 'testCode', state: guid };

    const getPreloginCaseDataMock = CaseService.getPreloginCaseData as jest.MockedFunction<
      (redisClient: RedisClient, guid: string) => Promise<string>
    >;

    getPreloginCaseDataMock.mockReturnValue(Promise.resolve(caseType));

    return idamCallbackHandler(req, res, next, serviceUrl).then(() =>
      expect(CaseService.getCaseApi).toHaveBeenCalled()
    );
  });

  test('Should redirect to NEW_ACCOUNT_LANDING page if successfully created case', async () => {
    req.query = { code: 'testCode', state: guid };
    const getPreloginCaseDataMock = CaseService.getPreloginCaseData as jest.MockedFunction<
      (redisClient: RedisClient, guid: string) => Promise<string>
    >;

    getPreloginCaseDataMock.mockReturnValue(Promise.resolve(caseType));

    //Given that case is created sucessfully
    const getCaseApiMock = CaseService.getCaseApi as jest.MockedFunction<(token: string) => CaseApi>;
    getCaseApiMock.mockReturnValue(caseApi);
    caseApi.createCase = jest.fn().mockResolvedValue(Promise.resolve({} as CaseDraftResponse));

    //Then it redirects to NEW_ACCOUNT_LANDING page
    idamCallbackHandler(req, res, next, serviceUrl);
    await new Promise(process.nextTick);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NEW_ACCOUNT_LANDING);
  });
});
