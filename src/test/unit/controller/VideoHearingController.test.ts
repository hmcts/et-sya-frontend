import sinon from 'sinon';
import { Response } from 'express';
import VideoHearingController from '../../../main/controllers/VideoHearingController';
import { mockRequest } from '../mocks/mockRequest';

const videoHearingController = new VideoHearingController();

describe('Video Hearing Controller', () => {
  const t = {
    'video-hearing': {},
  };

  it('should render the video hearing choice page', () => {
    const response = ({ render: () => '' } as unknown) as Response;
    const request = mockRequest(t);

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('video-hearing', request.t('video-hearing', { returnObjects: true }));

    videoHearingController.get(request, response);
    responseMock.verify();
  });

  it('should render the \'Steps to making your claim\' page when \'yes\' and the \'save and continue\' button are selected', () => {
    const response = { redirect: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'video-hearing': 'yes', saveAndContinue: 'saveAndContinue' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/steps-to-making-your-claim');

    videoHearingController.post(request, response);
    responseMock.verify();
  });

  it('should render the \'Steps to making your claim\' page when \'no\' and the \'save and continue\' button are selected', () => {
    const response = { redirect: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'video-hearing': 'no', saveAndContinue: 'saveAndContinue' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/steps-to-making-your-claim');

    videoHearingController.post(request, response);
    responseMock.verify();
  });

  it('should render the \'Your claim has been saved\' page when \'yes\' and the \'save for later\' button are selected', () => {
    const response = { redirect: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'video-hearing': 'yes', saveForLater: 'saveForLater' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/your-claim-has-been-saved');

    videoHearingController.post(request, response);
    responseMock.verify();
  });


  it('should render the \'Your claim has been saved\' page when \'no\' and the \'save for later\' button are selected', () => {
    const response = { redirect: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'video-hearing': 'no', saveForLater: 'saveForLater' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/your-claim-has-been-saved');

    videoHearingController.post(request, response);
    responseMock.verify();
  });



  it('should render same page if nothing selected and the \'save and continue\' button is selected', () => {
    const response = { render: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'video-hearing': '', saveAndContinue: 'saveAndContinue' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('video-hearing');

    videoHearingController.post(request, response);
    responseMock.verify();
  });

  it('should redirect to the \'Your claim has been saved\' page when a radio button is not selected and the \'save for later\' button is clicked', () => {
    const response = { redirect: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'video-hearing': '', saveForLater: 'saveForLater' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/your-claim-has-been-saved');

    videoHearingController.post(request, response);
    responseMock.verify();
  });

});
