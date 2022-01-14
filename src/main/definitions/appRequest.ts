import { Request } from 'express';
import { Session } from 'express-session';
import { CaseWithId } from './case';
import { FormError } from './form';

export interface AppRequest<T = Partial<any>> extends Request {
  session: AppSession;
  body: T;
}

export interface AppSession extends Session {
  lang: string | undefined;
  errors: FormError[] | undefined;
  userCase: CaseWithId;
}
