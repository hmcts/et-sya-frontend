import { Response } from 'express';
import sinon from 'sinon';

import VideoHearingsController from '../../../main/controllers/VideoHearingsController';
import { mockRequest } from '../mocks/mockRequest';

const videoHearingsController = new VideoHearingsController();

describe('Video Hearing Controller', () => {
  const t = {
    'video-hearings': {},
  };

  it('should render the video hearing choice page', () => {
    const response = { render: () => '' } as unknown as Response;
    const request = mockRequest({ t });

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('video-hearings', request.t('video-hearings', { returnObjects: true }));

    videoHearingsController.get(request, response);
    responseMock.verify();
  });

  it("should render the 'Steps to making your claim' page when 'yes' and the 'save and continue' button are selected", () => {
    const response = {
      redirect: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest({ t });
    request.body = { 'video-hearing': 'yes', saveButton: 'saveContinue' };

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/steps-to-making-your-claim');

    videoHearingsController.post(request, response);
    responseMock.verify();
  });

  it("should render the 'Steps to making your claim' page when 'no' and the 'save and continue' button are selected", () => {
    const response = {
      redirect: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest({ t });
    request.body = { 'video-hearing': 'no', saveButton: 'saveContinue' };

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/steps-to-making-your-claim');

    videoHearingsController.post(request, response);
    responseMock.verify();
  });

  it("should render the 'Your claim has been saved' page when 'yes' and the 'save for later' button are selected", () => {
    const response = {
      redirect: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest({ t });
    request.body = { 'video-hearing': 'yes', saveButton: 'saveForLater' };

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/your-claim-has-been-saved');

    videoHearingsController.post(request, response);
    responseMock.verify();
  });

  it("should render the 'Your claim has been saved' page when 'no' and the 'save for later' button are selected", () => {
    const response = {
      redirect: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest({ t });
    request.body = { 'video-hearing': 'no', saveButton: 'saveForLater' };

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/your-claim-has-been-saved');

    videoHearingsController.post(request, response);
    responseMock.verify();
  });

  it("should render same page if nothing selected and the 'save and continue' button is selected", () => {
    const response = {
      render: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest({ t });
    request.body = { 'video-hearing': '', saveButton: 'saveContinue' };

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('video-hearings');

    videoHearingsController.post(request, response);
    responseMock.verify();
  });

  it("should redirect to the 'Your claim has been saved' page when a radio button is not selected and the 'save for later' button is clicked", () => {
    const response = {
      redirect: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest({ t });
    request.body = { 'video-hearing': '', saveButton: 'saveForLater' };

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/your-claim-has-been-saved');

    videoHearingsController.post(request, response);
    responseMock.verify();
  });
});
