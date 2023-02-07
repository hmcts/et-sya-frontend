import SubmitTseController from '../../../main/controllers/SubmitTribunalCYAController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../../main/definitions/hub';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Submit tell something else Controller', () => {
  it('should redirect to PageUrls.APPLICATION_COMPLETE', () => {
    const controller = new SubmitTseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = PageUrls.APPLICATION_COMPLETE;
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.APPLICATION_COMPLETE);
  });

  it('should change hublink status to IN PROGRESS before submitting the case', () => {
    const controller = new SubmitTseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    controller.get(request, response);
    expect(request.session.userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toStrictEqual(
      HubLinkStatus.IN_PROGRESS
    );
  });

  it('should clear TSE fields after submitting the case and updating hublink statuses', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.contactApplicationText = 'Test text';
    request.session.userCase.contactApplicationFile = {
      document_url: 'testpage',
      document_filename: 'testname',
      document_binary_url: 'testbinary',
      document_size: 5,
      document_mime_type: 'pdf',
    };
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    jest.spyOn(CaseHelper, 'handleUpdateHubLinksStatuses').mockImplementationOnce(() => Promise.resolve());
    jest.spyOn(CaseHelper, 'submitClaimantTse').mockImplementationOnce(() => Promise.resolve());
    await new SubmitTseController().get(request, response);
    expect(request.session.userCase.contactApplicationText).toStrictEqual(undefined);
    expect(request.session.userCase.contactApplicationFile).toStrictEqual(undefined);
  });
});
