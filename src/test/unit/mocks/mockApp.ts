import express, { Express } from 'express';

import { app } from '../../../main/app';
import { AppSession } from '../../../main/definitions/appRequest';
import { CaseWithId } from '../../../main/definitions/case';
import { CaseState, TypesOfClaim } from '../../../main/definitions/definition';
import { FormError } from '../../../main/definitions/form';
import { AnyRecord } from '../../../main/definitions/util-types';

import { mockUserDetails } from './mockUser';

export function mockSession(typeOfClaimList: TypesOfClaim[], errorList: FormError[]): AppSession {
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
    },
    errors: errorList,
    guid: 'c8d6b6a3-e6bb-4225-82e5-db63fc66a2c8',
    user: {
      accessToken: 'testAccessToken',
      email: 'et.dev@hmcts.net',
      isCitizen: false,
      id: 'testUserId',
      givenName: 'test',
      familyName: 'user',
    },
  };
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
  mock.use(app);
  return mock;
};
