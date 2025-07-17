import CompensationController from '../../../main/controllers/CompensationController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Compensation Controller', () => {
  const t = {
    compensation: {},
    common: {},
  };

  it('should render the compensation page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    new CompensationController().get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.COMPENSATION, expect.anything());
  });

  describe('Correct validation', () => {
    it('should not require input (all fields are optional)', () => {
      const body = {};

      const req = mockRequest({ body });
      const res = mockResponse();
      new CompensationController().post(req, res);

      expect(req.session.errors).toHaveLength(0);
    });

    it('should allow valid compensation amount', () => {
      const body = {
        compensationOutcome: '',
        compensationAmount: '£100.12',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new CompensationController().post(req, res);

      expect(req.session.errors).toHaveLength(0);
    });

    it('should not allow invalid compensation outcome text', () => {
      const body = {
        compensationOutcome: '1'.repeat(2501),
        compensationAmount: '',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new CompensationController().post(req, res);

      const expectedErrors = [{ propertyName: 'compensationOutcome', errorType: 'tooLong' }];

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should not allow numbers invalid currency input', () => {
      const body = {
        compensationOutcome: '',
        compensationAmount: '-1',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new CompensationController().post(req, res);

      const expectedErrors = [{ propertyName: 'compensationAmount', errorType: 'invalidCurrency' }];

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should assign userCase from the page form data', () => {
      const body = {
        compensationOutcome: 'ab',
        compensationAmount: '50',
      };
      const req = mockRequest({ body });
      const res = mockResponse();

      new CompensationController().post(req, res);

      expect(req.session.userCase).toMatchObject({
        compensationOutcome: 'ab',
        compensationAmount: '50',
      });
    });
  });
});
