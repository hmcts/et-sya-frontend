import ComfortableController from '../../../main/controllers/ComfortableController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Comfortable Controller', () => {
  const t = {
    comfortable: {},
    common: {},
  };

  it('should render the "need something to make me feel comfortable" page', () => {
    const controller = new ComfortableController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  it('should redirect back to the "need something to make me feel comfortable" page when errors are present', () => {
    const errors = [{ propertyName: 'comfortable', errorType: 'required' }];
    const body = { comfortable: [''] };

    const controller = new ComfortableController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
  it('should assign userCase from the page form data', () => {
    const body = {
      comfortable: ['appropriateLighting', 'regularBreaks'],
      comfortableAppropriateLightingExplanation: 'high luminosity',
    };
    const controller = new ComfortableController();
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      comfortable: ['appropriateLighting', 'regularBreaks'],
      comfortableAppropriateLightingExplanation: 'high luminosity',
    });
  });
});
