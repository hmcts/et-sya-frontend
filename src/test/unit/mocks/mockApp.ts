import express, { Express } from 'express';
import { RedisClient } from 'redis';
import redis from 'redis-mock';

import { app } from '../../../main/app';
import { AppSession } from '../../../main/definitions/appRequest';
import { CaseDataCacheKey, CaseWithId } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState, TellUsWhatYouWant, TypesOfClaim } from '../../../main/definitions/definition';
import { FormError } from '../../../main/definitions/form';
import { HubLinkStatus, HubLinks } from '../../../main/definitions/hub';
import { AnyRecord } from '../../../main/definitions/util-types';

import { mockUserDetails } from './mockUser';

export function mockSession(
  typeOfClaimList: TypesOfClaim[],
  tellUsWhatYouWantList: TellUsWhatYouWant[],
  errorList: FormError[]
): AppSession {
  return {
    id: 'testSessionId',
    lang: 'en',
    regenerate: this,
    destroy: this,
    reload: this,
    resetMaxAge: this,
    save: this,
    touch: this,
    cookie: {
      originalMaxAge: 3600000,
      expires: new Date(new Date().getDate() + 1),
      httpOnly: true,
      path: '/',
    },
    userCase: {
      id: 'testUserCaseId',
      state: CaseState.DRAFT,
      typeOfClaim: typeOfClaimList,
      tellUsWhatYouWant: tellUsWhatYouWantList,
    },
    errors: errorList,
    guid: 'kedicik6-l0v3-y0u2-t1h3-mehmet9c3d68',
    user: {
      accessToken: 'testAccessToken',
      email: 'et.dev@hmcts.net',
      isCitizen: false,
      id: 'testUserId',
      givenName: 'test',
      familyName: 'user',
    },
    returnUrl: undefined,
  };
}

export function mockRedisClient(cacheMap: Map<CaseDataCacheKey, string>): RedisClient {
  const redisClient = redis.createClient();
  const guid = 'kedicik6-l0v3-y0u2-t1h3-mehmet9c3d68';
  redisClient.set(guid, JSON.stringify(Array.from(cacheMap.entries())));
  return redisClient;
}

export const mockApp = ({
  body,
  userCase,
  session,
}: {
  body?: AnyRecord;
  userCase?: Partial<CaseWithId>;
  session?: AppSession;
}): Express => {
  const hubLinks = new HubLinks();
  Object.keys(hubLinks).forEach(key => {
    hubLinks[key] = {
      link: PageUrls.HOME,
      status: HubLinkStatus.NOT_YET_AVAILABLE,
    };
  });

  const mock = express();
  mock.all('*', function (req, res, next) {
    req.body = body;
    req.session = {
      userCase: {
        id: '1234',
        dobDate: { year: '2000', month: '12', day: '24' },
        // todo remove this from the mockapp, only needs to be for the hub content tests.
        hubLinks,
        ...userCase,
      } as CaseWithId,
      ...session,
      save: jest.fn(done => done()),
      lang: 'en',
      errors: undefined,
      user: mockUserDetails,
    } as unknown as AppSession;
    next();
  });
  mock.use(app);
  return mock;
};

export const mockAppWithRedisClient = ({
  body,
  userCase,
  session,
  redisClient,
}: {
  body?: AnyRecord;
  userCase?: Partial<CaseWithId>;
  session?: AppSession;
  redisClient?: RedisClient;
}): Express => {
  const mock = express();
  mock.all('*', function (req, res, next) {
    req.body = body;
    req.session = {
      userCase: {
        id: '1234',
        dobDate: { year: '2000', month: '12', day: '24' },
        ...userCase,
      } as CaseWithId,
      ...session,
      save: jest.fn(done => done()),
      lang: 'en',
      errors: undefined,
      user: mockUserDetails,
    } as unknown as AppSession;
    next();
  });
  app.locals.redisClient = redisClient;
  mock.use(app);
  return mock;
};
