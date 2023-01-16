import { Request } from 'express';
import { Session } from 'express-session';

import { CaseWithId } from './case';
import { FormError } from './form';
import { AnyRecord } from './util-types';

export interface AppRequest<T = Partial<AnyRecord>> extends Request {
  session: AppSession;
  body: T;
  fileTooLarge?: boolean;
}

export interface AppSession extends Session {
  returnUrl: string;
  lang: string | undefined;
  errors: FormError[] | undefined;
  userCase: CaseWithId;
  user: UserDetails;
  guid: string | undefined;
  fileTooLarge?: boolean;
  cookies?: string;
  contactType?: string;
  contactTribunalSelection?: string;
}

export interface UserDetails {
  accessToken: string;
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  isCitizen: boolean;
}
