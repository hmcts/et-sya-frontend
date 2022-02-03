import { Request } from 'express';
import { Session } from 'express-session';

import { Case, CaseWithId } from './case';
import { FormError } from './form';

export interface AppRequest<T = Partial<Case>> extends Request {
  session: AppSession;
  body: T;
}

export interface AppSession extends Session {
  lang: string | undefined;
  errors: FormError[] | undefined;
  userCase: CaseWithId;
  user: UserDetails;
}

export interface UserDetails {
  accessToken: string;
  id: string;
  email: string;
  givenName: string;
  familyName: string;
}
