import SubmitRespondentController from '../../../main/controllers/SubmitRespondentController';
import SubmitTseController from '../../../main/controllers/SubmitTribunalCYAController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, languages } from '../../../main/definitions/constants';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Submit respondent controller', () => {
  it('should redirect to PageUrls.RESPONDENT_APPLICATION_COMPLETE', async () => {
    const controller = new SubmitRespondentController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = PageUrls.RESPOND_TO_APPLICATION_COMPLETE;

    jest.spyOn(CaseHelper, 'handleUpdateHubLinksStatuses').mockImplementationOnce(() => Promise.resolve());
    jest.spyOn(CaseHelper, 'respondToApplication').mockImplementationOnce(() => Promise.resolve());

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(
      PageUrls.RESPOND_TO_APPLICATION_COMPLETE + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should set rule92state based on Rule 92 answer', async () => {
    const controller = new SubmitRespondentController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.copyToOtherPartyYesOrNo = YesOrNo.YES;

    jest.spyOn(CaseHelper, 'respondToApplication').mockImplementationOnce(() => Promise.resolve());

    await controller.get(request, response);
    expect(request.session.userCase.rule92state).toStrictEqual(true);
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
    expect(request.session.userCase.responseText).toStrictEqual(undefined);
    expect(request.session.userCase.supportingMaterialFile).toStrictEqual(undefined);
    expect(request.session.userCase.copyToOtherPartyYesOrNo).toStrictEqual(undefined);
  });
});
