import SubmitTseController from '../../../main/controllers/SubmitTribunalCYAController';
import TribunalResponseSubmitController from '../../../main/controllers/TribunalResponseSubmitController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../../main/definitions/hub';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal response submit controller', () => {
  it('should redirect to PageUrls.APPLICATION_COMPLETE', () => {
    const controller = new TribunalResponseSubmitController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = PageUrls.TRIBUNAL_RESPONSE_COMPLETED;
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.TRIBUNAL_RESPONSE_COMPLETED);
  });

  it('should change hublink status to IN PROGRESS before submitting the case', () => {
    const controller = new TribunalResponseSubmitController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    controller.get(request, response);
    expect(request.session.userCase.hubLinksStatuses[HubLinkNames.TribunalOrders]).toStrictEqual(
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
    expect(request.session.userCase.copyToOtherPartyYesOrNo).toStrictEqual(undefined);
    expect(request.session.userCase.copyToOtherPartyText).toStrictEqual(undefined);
  });
});
