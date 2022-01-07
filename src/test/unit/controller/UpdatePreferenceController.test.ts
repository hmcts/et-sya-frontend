import sinon from 'sinon';
import { Response } from 'express';
import UpdatePreferenceController from '../../../main/controllers/UpdatePreferenceController';
import { mockRequest } from '../mocks/mockRequest';

const updatePreferenceController = new UpdatePreferenceController();

describe('Update Preference Controller', () => {
  const t = {
    'update-preference': {},
  };

  it('should render the \'How would you like to be updated about your claim?\' page', () => {
    const response = ({ render: () => '' } as unknown) as Response;
    const request = mockRequest(t);

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('update-preference', request.t('update-preference', { returnObjects: true }));

    updatePreferenceController.get(request, response);
    responseMock.verify();
  });

  it('should render the video hearings page when \'Email\' is selected and \'Save and Continue\' button pressed', () => {
    const response = { redirect: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'update-preference': 'email', 'saveButton' : 'saveContinue' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/would-you-want-to-take-part-in-video-hearings');

    updatePreferenceController.post(request, response);
    responseMock.verify();
  });

  it('should render the video hearings page when \'Post\' is selected and \'Save and Continue\' button pressed', () => {
    const response = { redirect: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'update-preference': 'post', 'saveButton' : 'saveContinue' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/would-you-want-to-take-part-in-video-hearings');

    updatePreferenceController.post(request, response);
    responseMock.verify();
  });

  it('should render the claim saved page when \'Email\' is selected and \'Save for later\' button pressed', () => {
    const response = { redirect: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'update-preference': 'email', 'saveButton' : 'saveForLater' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/your-claim-has-been-saved');

    updatePreferenceController.post(request, response);
    responseMock.verify();
  });

  it('should render the claim saved page when \'Post\' is selected and \'Save for later\' button pressed', () => {
    const response = { redirect: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'update-preference': 'post', 'saveButton' : 'saveForLater' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/your-claim-has-been-saved');

    updatePreferenceController.post(request, response);
    responseMock.verify();
  });

  it('should render same page if nothing selected', () => {
    const response = { render: () => { return ''; } } as unknown as Response;
    const request = mockRequest(t);
    request.body = { 'update-preference': '' };

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('update-preference');

    updatePreferenceController.post(request, response);
    responseMock.verify();
  });

});
