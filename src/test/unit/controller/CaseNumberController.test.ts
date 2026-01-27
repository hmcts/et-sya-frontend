import CaseNumberController from '../../../main/controllers/CaseNumberController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('CaseNumberController', () => {
  const t = {
    'case-number-check': {},
    common: {},
  };

  it('should render the case-number-check page', () => {
    const controller = new CaseNumberController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('case-number-check', expect.anything());
  });

  it('should redirect back to self if there are errors', () => {
    const errors = [{ propertyName: 'ethosCaseReference', errorType: 'required' }];
    const body = { ethosCaseReference: '' };
    const controller = new CaseNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to home page when case number is provided', () => {
    const body = { ethosCaseReference: '1234567/2023' };
    const controller = new CaseNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalled();
    expect(req.session.errors).toHaveLength(0);
  });

  it('should save case number to user case', () => {
    const body = { ethosCaseReference: '1234567/2023' };
    const controller = new CaseNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(req.session.userCase.ethosCaseReference).toBe('1234567/2023');
  });
});
