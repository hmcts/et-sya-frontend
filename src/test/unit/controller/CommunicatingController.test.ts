import CommunicatingController from '../../../main/controllers/CommunicatingController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Communicating Controller', () => {
  const t = {
    communicating: {},
    common: {},
  };

  it('should render the "I need help communicating" page', () => {
    const controller = new CommunicatingController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  it('should redirect back to the "I need help communicating" page when errors are present', () => {
    const errors = [{ propertyName: 'communicating', errorType: 'required' }];
    const body = { communicating: [''] };

    const controller = new CommunicatingController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should assign userCase from the page form data', () => {
    const body = {
      communicating: ['hearingLoop', 'InfraredReceiver', 'Intermediary'],
      communicatingIntermediaryExplanation: 'need help with this',
    };
    const controller = new CommunicatingController();
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      communicating: ['hearingLoop', 'InfraredReceiver', 'Intermediary'],
      communicatingIntermediaryExplanation: 'need help with this',
    });
  });
});
