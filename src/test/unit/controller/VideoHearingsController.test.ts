import VideoHearingsController from '../../../main/controllers/VideoHearingsController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Preferences Controller', () => {
  const t = {
    'video-hearings': {},
    common: {},
  };

  it('should render the video hearings choice page', () => {
    const controller = new VideoHearingsController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('video-hearings', expect.anything());
  });

  it('should render same page if errors are present', () => {
    const errors = [{ propertyName: 'hearingPreference', errorType: 'required' }];
    const body = { hearingPreference: '' };
    const controller = new VideoHearingsController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the videoHearings form value to the userCase', () => {
    const body = { hearingPreference: 'phone' };

    const controller = new VideoHearingsController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({ hearingPreference: ['phone'] });
  });
});
