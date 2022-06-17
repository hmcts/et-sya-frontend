import { AppRequest, AppSession } from '../../../main/definitions/appRequest';
import { CaseWithId } from '../../../main/definitions/case';
import { AnyRecord } from '../../../main/definitions/util-types';

export const mockRequest = ({
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

  req.t = jest.fn().mockReturnValue(req);
  req.body = body;
  req.session = {
    userCase: {
      id: '1234',
      dobDate: { year: '2000', month: '12', day: '24' },
      startDate: { year: '2019', month: '04', day: '21' },
      ...userCase,
    } as CaseWithId,
    ...session,
    save: jest.fn(done => (done ? done() : true)),
    lang: 'en',
    errors: undefined,
  } as unknown as AppSession;
  return req;
};
