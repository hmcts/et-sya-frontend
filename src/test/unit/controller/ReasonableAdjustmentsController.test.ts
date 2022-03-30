import ReasonableAdjustmentsController from '../../../main/controllers/ReasonableAdjustmentsController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Reasonable Adjustments Controller', () => {
  const t = {
    'reasonable-adjustments': {},
    common: {},
  };

  it('should render the Reasonable Adjustments page', () => {
    const controller = new ReasonableAdjustmentsController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  describe('post() reasobable adjustments', () => {
    it('should redirect back to the Reasonable Adjustments page when errors are present', () => {
      const errors = [{ propertyName: 'reasonableAdjustments', errorType: 'required' }];
      const body = { reasonableAdjustments: [''] };

      const controller = new ReasonableAdjustmentsController();

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from reasonable adjustments form data', () => {
      const body = { reasonableAdjustments: ['documents', 'support', 'comfortable'] };
      const controller = new ReasonableAdjustmentsController();

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(req.session.userCase).toStrictEqual({
        reasonableAdjustments: ['documents', 'support', 'comfortable'],
      });
    });
  });
});
