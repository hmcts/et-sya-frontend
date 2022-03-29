import SupportController from '../../../main/controllers/SupportController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Support Controller', () => {
  const t = {
    support: {},
    common: {},
  };

  it('should render the "I need support" page', () => {
    const controller = new SupportController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  it('should redirect back to the "I need support" page when errors are present', () => {
    const errors = [{ propertyName: 'support', errorType: 'required' }];
    const body = { support: [''] };

    const controller = new SupportController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should assign userCase from the page form data', () => {
    const body = {
      support: ['friendOrFamily', 'other'],
      supportFriendOrFamilyExplanation: 'friend is required',
    };
    const controller = new SupportController();
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      support: ['friendOrFamily', 'other'],
      supportFriendOrFamilyExplanation: 'friend is required',
    });
  });
});
