import { LoggerInstance } from 'winston';

import ClaimTypePayController from '../../../main/controllers/ClaimTypePayController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Type Pay Controller', () => {
  const t = {
    'claim-type-pay': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the claim type pay page', () => {
    const controller = new ClaimTypePayController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_TYPE_PAY, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require claimTypePay', () => {
      const req = mockRequest({ body: {} });
      new ClaimTypePayController(mockLogger).post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'claimTypePay', errorType: 'required' }]);
    });

    it('should assign userCase from the page form data', () => {
      const req = mockRequest({ body: { claimTypePay: ['holidayPay'] } });
      new ClaimTypePayController(mockLogger).post(req, mockResponse());

      expect(req.session.userCase).toMatchObject({
        claimTypePay: ['holidayPay'],
      });
    });
  });
});
