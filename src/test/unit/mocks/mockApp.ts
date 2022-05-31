import express, { Express } from 'express';

import { app } from '../../../main/app';
import { AppSession } from '../../../main/definitions/appRequest';
import { CaseWithId } from '../../../main/definitions/case';
import { AnyRecord } from '../../../main/definitions/util-types';

import { mockUserDetails } from './mockUser';

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
