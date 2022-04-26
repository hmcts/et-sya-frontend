import { Request } from 'express';
import { Session } from 'express-session';

import { CaseWithId } from './case';
import { FormError } from './form';
import { AnyRecord } from './util-types';

export interface AppRequest<T = Partial<AnyRecord>> extends Request {
  session: AppSession;
  body: T;
}

export interface AppSession extends Session {
  lang: string | undefined;
  errors: FormError[] | undefined;
  userCase: CaseWithId;
  user: UserDetails;
  guid: string | undefined;
}

export interface UserDetails {
  accessToken: string;
  id: string;
  email: string;
  givenName: string;
  familyName: string;
}
