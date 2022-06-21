import ReasonableAdjustmentsController from '../../../main/controllers/ReasonableAdjustmentsController';
import { PageUrls } from '../../../main/definitions/constants';
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

    expect(response.render).toHaveBeenCalledWith('reasonable-adjustments', expect.anything());
  });

  describe('post() reasonable adjustments', () => {
    it('should redirect to the next page when nothing is selected as the form is optional', () => {
      const body = {};

      const controller = new ReasonableAdjustmentsController();

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.PERSONAL_DETAILS_CHECK);
    });
  });
});
