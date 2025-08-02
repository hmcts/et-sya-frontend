import { Request } from 'express';
import { Session } from 'express-session';

import { CaseWithId } from './case';
import { FormError } from './form';
import { AnyRecord } from './util-types';

export interface AppRequest<T = Partial<AnyRecord>> extends Request {
  req: {
    userCase: {
      id: string;
      state: import('/Users/mehmet.dede/dev/Webstorm/et-sya/et-sya-frontend/src/main/definitions/definition').CaseState.DRAFT;
      createdDate: string;
      lastModified: string;
    };
  };
  req: { userCase: { id: string; state: any; createdDate: string; lastModified: string } };
  session: AppSession;
  body: T;
  fileTooLarge?: boolean;
}

export interface AppSession extends Session {
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
}

export interface UserDetails {
  accessToken: string;
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  isCitizen: boolean;
}
