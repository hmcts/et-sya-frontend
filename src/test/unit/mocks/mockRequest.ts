import { AppRequest } from 'definitions/appRequest';
import { CaseWithId } from 'definitions/case';

export const mockRequest = ({
  body,
  userCase,
  session,
  t,
}: any): AppRequest => {
  const req = {
    t: () => t,
  } as unknown as AppRequest;

  req.t = jest.fn().mockReturnValue(req);
  req.body = body;
  req.session = {
    userCase: {
      id: '1234',
      dobDate: { year: '2000', month: '12', day: '24' },
      ...userCase,
    } as CaseWithId,
    ...session,
    save: jest.fn((done) => done()),
    lang: 'en',
    errors: undefined,
  } as any;
  return req;
};
