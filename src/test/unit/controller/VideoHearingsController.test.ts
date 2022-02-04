import VideoHearingsController from '../../../main/controllers/VideoHearingsController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const videoHearingsController = new VideoHearingsController();

describe('Video Hearing Controller', () => {
  const t = {
    'video-hearings': {},
  };

  it('should render the video hearing choice page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    videoHearingsController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('video-hearings', expect.anything());
  });

  it("should render the 'Steps to making your claim' page when 'yes' and the 'save and continue' button are selected", () => {
    const response = mockResponse();
    const body = { 'video-hearing': 'yes', saveButton: 'saveContinue' };
    const request = mockRequest({ t, body });

    videoHearingsController.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/steps-to-making-your-claim');
  });

  it("should render the 'Steps to making your claim' page when 'no' and the 'save and continue' button are selected", () => {
    const response = mockResponse();
    const body = { 'video-hearing': 'no', saveButton: 'saveContinue' };
    const request = mockRequest({ t, body });

    videoHearingsController.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/steps-to-making-your-claim');
  });

  it("should redirect to the 'Your claim has been saved' page when 'yes' and the 'save for later' button are selected", () => {
    const response = mockResponse();
    const body = { 'video-hearing': 'yes', saveButton: 'saveForLater' };
    const request = mockRequest({ t, body });

    videoHearingsController.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/your-claim-has-been-saved');
  });

  it("should redirect to the 'Your claim has been saved' page when 'no' and the 'save for later' button are selected", () => {
    const response = mockResponse();
    const body = { 'video-hearing': 'no', saveButton: 'saveForLater' };
    const request = mockRequest({ t, body });

    videoHearingsController.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/your-claim-has-been-saved');
  });

  it("should render same page if nothing selected and the 'save and continue' button is selected", () => {
    const response = mockResponse();
    const body = { 'video-hearing': '', saveButton: 'saveContinue' };
    const request = mockRequest({ t, body });

    videoHearingsController.post(request, response);

    expect(response.render).toHaveBeenCalledWith('video-hearings', expect.anything());
  });

  it("should redirect to the 'Your claim has been saved' page when a radio button is not selected and the 'save for later' button is clicked", () => {
    const response = mockResponse();
    const body = { 'video-hearing': '', saveButton: 'saveForLater' };
    const request = mockRequest({ t, body });

    videoHearingsController.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/your-claim-has-been-saved');
  });
});
