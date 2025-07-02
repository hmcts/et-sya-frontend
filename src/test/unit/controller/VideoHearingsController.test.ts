import VideoHearingsController from '../../../main/controllers/VideoHearingsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
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

  it('should add the videoHearings form value to the userCase', async () => {
    const body = { hearingPreferences: 'Phone' };

    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

    const controller = new VideoHearingsController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({ hearingPreferences: ['Phone'], state: 'AWAITING_SUBMISSION_TO_HMCTS' });
  });
});
