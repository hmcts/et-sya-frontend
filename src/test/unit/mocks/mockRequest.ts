import i18next from 'i18next';

import { AppRequest, AppSession } from '../../../main/definitions/appRequest';
import {
  CaseWithId,
  HearingPanelPreference,
  HearingPreference,
  Sex,
  StillWorking,
  YesOrNo,
} from '../../../main/definitions/case';
import { languages } from '../../../main/definitions/constants';
import { AnyRecord } from '../../../main/definitions/util-types';

export const mockRequest = ({
  body,
  userCase,
  session,
  t,
  file,
}: {
  body?: AnyRecord;
  userCase?: Partial<CaseWithId>;
  session?: AnyRecord;
  cookies?: string;
  t?: AnyRecord;
  file?: Express.Multer.File;
}): AppRequest => {
  const req = {
    t: () => t,
  } as unknown as AppRequest;

  (req.t as any) = jest.fn().mockReturnValue(req);
  req.body = body;
  req.file = file;
  req.params = {
    respondentNumber: '1',
  };
  req.headers = {
    host: 'http://localhost:3002',
  };
  req.cookies = {
    i18next: languages.ENGLISH,
  };
  req.session = {
    userCase: {
      id: '1234',
      dobDate: { year: '2000', month: '12', day: '24' },
      startDate: { year: '2019', month: '04', day: '21' },
      ...userCase,
    } as CaseWithId,
    submittedCase: {
      id: '1234',
      dobDate: { year: '2000', month: '12', day: '24' },
      startDate: { year: '2019', month: '04', day: '21' },
      ...userCase,
    } as CaseWithId,
    ...session,
    save: jest.fn(done => (done ? done() : true)),
    lang: 'en',
    errors: undefined,
    cookies: i18next,
  } as unknown as AppSession;
  return req;
};

export const mockRequestEmpty = ({
  body,
  userCase,
  session,
  t,
  file,
}: {
  body?: AnyRecord;
  userCase?: Partial<CaseWithId>;
  session?: AnyRecord;
  t?: AnyRecord;
  file?: Express.Multer.File;
}): AppRequest => {
  const req = {
    t: () => t,
  } as unknown as AppRequest;

  (req.t as any) = jest.fn().mockReturnValue(req);
  req.body = body;
  req.file = file;
  req.params = {
    respondentNumber: '1',
  };
  req.session = {
    userCase: {
      ...userCase,
    } as CaseWithId,
    submittedCase: {
      ...userCase,
    } as CaseWithId,
    ...session,
    save: jest.fn(done => (done ? done() : true)),
    lang: 'en',
    errors: undefined,
  } as unknown as AppSession;
  return req;
};

export const mockRequestWithTranslation = (
  {
    body,
    userCase,
    session,
    t,
  }: {
    body?: AnyRecord;
    userCase?: Partial<CaseWithId>;
    session?: AnyRecord;
    t?: AnyRecord;
  },
  translations: AnyRecord
): AppRequest => {
  const req = {
    t: () => t,
  } as unknown as AppRequest;

  (req.t as any) = jest.fn().mockReturnValue(translations);
  req.body = body;
  req.params = {
    respondentNumber: '1',
    appId: '1',
  };
  req.headers = {
    host: 'http://localhost:3002',
  };
  req.session = {
    userCase: {
      id: '1234',
      dobDate: { year: '2000', month: '12', day: '24' },
      startDate: { year: '2019', month: '04', day: '21' },
      noticeEnds: { year: '2019', month: '04', day: '21' },
      newJob: YesOrNo.YES,
      newJobStartDate: { year: '2020', month: '04', day: '21' },
      isStillWorking: StillWorking.NOTICE,
      typeOfClaim: [],
      claimantSex: Sex.FEMALE,
      hearingPreferences: [HearingPreference.NEITHER],
      hearingPanelPreference: HearingPanelPreference.JUDGE,
      hearingPanelPreferenceReasonJudge: 'Judge test reason',
      hearingPanelPreferenceReasonPanel: '',
      ...userCase,
    } as CaseWithId,
    submittedCase: {
      id: '1234',
      dobDate: { year: '2000', month: '12', day: '24' },
      startDate: { year: '2019', month: '04', day: '21' },
      noticeEnds: { year: '2019', month: '04', day: '21' },
      newJob: YesOrNo.YES,
      newJobStartDate: { year: '2020', month: '04', day: '21' },
      isStillWorking: StillWorking.NOTICE,
      typeOfClaim: [],
      claimantSex: Sex.FEMALE,
      hearingPreferences: [HearingPreference.NEITHER],
      hearingPanelPreference: HearingPanelPreference.JUDGE,
      hearingPanelPreferenceReasonJudge: 'Judge test reason',
      hearingPanelPreferenceReasonPanel: '',
      ...userCase,
    } as CaseWithId,
    ...session,
    save: jest.fn(done => (done ? done() : true)),
    lang: 'en',
    errors: undefined,
    user: { accessToken: 'token' },
  } as unknown as AppSession;
  return req;
};

export const mockRequestWithSaveException = ({
  body,
  userCase,
  session,
  t,
}: {
  body?: AnyRecord;
  userCase?: Partial<CaseWithId>;
  session?: AnyRecord;
  t?: AnyRecord;
}): AppRequest => {
  const req = {
    t: () => t,
  } as unknown as AppRequest;

  (req.t as any) = jest.fn().mockReturnValue(req);
  req.body = body;
  req.params = {
    respondentNumber: '1',
  };
  req.session = {
    userCase: {
      id: '1234',
      dobDate: { year: '2000', month: '12', day: '24' },
      startDate: { year: '2019', month: '04', day: '21' },
      ...userCase,
    } as CaseWithId,
    submittedCase: {
      id: '1234',
      dobDate: { year: '2000', month: '12', day: '24' },
      startDate: { year: '2019', month: '04', day: '21' },
      ...userCase,
    } as CaseWithId,
    ...session,
    save: jest.fn(() => {
      throw new Error('Something went wrong');
    }),
    lang: 'en',
    errors: undefined,
  } as unknown as AppSession;
  return req;
};
