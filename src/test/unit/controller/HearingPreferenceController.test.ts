import { LoggerInstance } from 'winston';

import HearingPreferenceController from '../../../main/controllers/HearingPreferenceController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Preference Controller', () => {
  const t = {
    'hearing-preference': {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the hearing preference page', () => {
    const controller = new HearingPreferenceController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('hearing-preference', expect.anything());
  });

  it('should render same page if errors are present', () => {
    const errors = [{ propertyName: 'hearing_preferences', errorType: 'required' }];
    const body = { hearing_preferences: '' };
    const controller = new HearingPreferenceController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the videoHearings form value to the userCase', () => {
    const body = { hearing_preferences: 'Phone' };

    const controller = new HearingPreferenceController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({ hearing_preferences: ['Phone'] });
  });
});
