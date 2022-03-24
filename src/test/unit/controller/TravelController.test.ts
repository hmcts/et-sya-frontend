import TravelController from '../../../main/controllers/TravelController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Travel Controller', () => {
  const t = {
    travel: {},
    common: {},
  };

  it('should render the "I need help travelling" page', () => {
    const controller = new TravelController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  it('should redirect back to the "I need help travelling" page when errors are present', () => {
    const errors = [{ propertyName: 'travel', errorType: 'required' }];
    const body = { travel: [''] };

    const controller = new TravelController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
  it('should assign userCase from the page form data', () => {
    const body = {
      travel: ['taxi', 'other'],
      travelTaxiExplanation: 'accessible taxi preferred',
      travelOtherExplanation: 'general help',
    };
    const controller = new TravelController();
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      travel: ['taxi', 'other'],
      travelTaxiExplanation: 'accessible taxi preferred',
      travelOtherExplanation: 'general help',
    });
  });
});
