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
  visitedContactTribunalSelection?: boolean;
  returnUrl: string;
  lang: string | undefined;
  errors: FormError[] | undefined;
  userCase: CaseWithId;
  submittedCase?: CaseWithId;
  user: UserDetails;
  guid: string | undefined;
  fileTooLarge?: boolean;
  cookies?: string;
  respondentRedirectCheckAnswer?: boolean;
  contactType?: string;
  contactTribunalSelection?: string;
  documentDownloadPage?: string;
  caseNumberChecked?: boolean;
  claimantFirstName?: string;
  claimantLastName?: string;
}

export interface UserDetails {
  accessToken: string;
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  isCitizen: boolean;
}
