import CompensationOutcomeController from '../../../main/controllers/CompensationOutcomeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Compensation Outcome Controller', () => {
  const t = {
    'compensation-outcome': {},
    common: {},
  };

  it('should render Compensation Outcome page', () => {
    const controller = new CompensationOutcomeController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.COMPENSATION_OUTCOME, expect.anything());
  });

  describe('post()', () => {
    it('should assign userCase from formData for Compensation Outcome', () => {
      const body = { compensationOutcome: 'test', compensationAmount: 10 };

      const controller = new CompensationOutcomeController();
      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.CLAIM_STEPS);
      expect(req.session.userCase).toStrictEqual({
        compensationOutcome: 'test',
        compensationAmount: 10,
      });
    });
  });
});
