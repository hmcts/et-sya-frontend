import { LoggerInstance } from 'winston';

import WhistleblowingClaimsController from '../../../main/controllers/WhistleblowingClaimsController';
import { YesOrNo } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Whistleblowing Claims Controller', () => {
  const t = {
    'whistleblowing-claims': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the whistleblowing claims page', () => {
    const controller = new WhistleblowingClaimsController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.WHISTLEBLOWING_CLAIMS, expect.anything());
  });

  describe('Correct validation', () => {
    it('should not require input for forwarding whistleblower claim input', () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      new WhistleblowingClaimsController(mockLogger).post(req, res);

      expect(req.session.errors).toHaveLength(0);
    });

    it('should require regulator or body name if selected yes for forwarding', () => {
      const req = mockRequest({ body: { whistleblowingClaim: YesOrNo.YES } });
      const res = mockResponse();
      new WhistleblowingClaimsController(mockLogger).post(req, res);

      const expectedErrors = [{ propertyName: 'whistleblowingEntityName', errorType: 'required' }];

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should require not too short regulator or body name if selected yes for forwarding', () => {
      const Req = mockRequest({
        body: {
          whistleblowingClaim: YesOrNo.YES,
          whistleblowingEntityName: 'Mr',
        },
      });
      const Res = mockResponse();
      new WhistleblowingClaimsController(mockLogger).post(Req, Res);

      const expectedErrors = [{ propertyName: 'whistleblowingEntityName', errorType: 'invalidLength' }];

      expect(Res.redirect).toHaveBeenCalledWith(Req.path);

      expect(Req.session.errors).toEqual(expectedErrors);
    });

    it('should require not too long regulator or body name if selected yes for forwarding', () => {
      const Req = mockRequest({
        body: {
          whistleblowingClaim: YesOrNo.YES,
          whistleblowingEntityName: '1'.repeat(101),
        },
      });
      const Res = mockResponse();
      new WhistleblowingClaimsController(mockLogger).post(Req, Res);

      const expectedErrors = [{ propertyName: 'whistleblowingEntityName', errorType: 'invalidLength' }];

      expect(Res.redirect).toHaveBeenCalledWith(Req.path);

      expect(Req.session.errors).toEqual(expectedErrors);
    });

    it('should assign userCase from the page form data', () => {
      const req = mockRequest({
        body: {
          whistleblowingClaim: YesOrNo.YES,
          whistleblowingEntityName: 'name',
        },
      });
      const res = mockResponse();

      new WhistleblowingClaimsController(mockLogger).post(req, res);

      expect(req.session.userCase).toMatchObject({
        whistleblowingClaim: YesOrNo.YES,
        whistleblowingEntityName: 'name',
      });
    });
  });
});
