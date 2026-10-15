import StoredApplicationConfirmationController from '../../../main/controllers/StoredApplicationConfirmationController';
import { CaseType, YesOrNo } from '../../../main/definitions/case';
import { Applicant, ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Store application Complete Controller tests', () => {
  const t = {
    'stored-application-confirmation': {},
    'application-complete': {},
    common: {},
  };

  const mockClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockClient.mockResolvedValue(true);

  it('should render the Store application Complete page when isGroupClaim is false', async () => {
    const controller = new StoredApplicationConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.appId = '246';
    request.session.userCase.tseApplicationStoredCollection = [{ id: '246', value: { applicant: Applicant.CLAIMANT } }];

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.STORED_APPLICATION_CONFIRMATION,
      expect.objectContaining({
        redirectUrl: '/citizen-hub/1234',
        viewThisCorrespondenceLink: '/application-details/246?lng=en',
        document: undefined,
        documentLink: '',
      })
    );
  });

  it('should render APPLICATION_COMPLETE page with rule92 true when isGroupClaim is true and copyToOtherParty is YES', async () => {
    const controller = new StoredApplicationConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.appId = '246';
    request.session.userCase.caseType = CaseType.MULTIPLE;
    request.session.userCase.tseApplicationStoredCollection = [
      { id: '246', value: { applicant: Applicant.CLAIMANT, copyToOtherPartyYesOrNo: YesOrNo.YES } },
    ];

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.APPLICATION_COMPLETE,
      expect.objectContaining({
        rule92: true,
        redirectUrl: '/citizen-hub/1234?lng=en',
        yourApplicationsUrl: '/group-claim-requests-and-applications',
      })
    );
  });

  it('should render APPLICATION_COMPLETE page with rule92 false when isGroupClaim is true and copyToOtherParty is NO', async () => {
    const controller = new StoredApplicationConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.appId = '246';
    request.session.userCase.caseType = CaseType.MULTIPLE;
    request.session.userCase.tseApplicationStoredCollection = [
      { id: '246', value: { applicant: Applicant.CLAIMANT, copyToOtherPartyYesOrNo: YesOrNo.NO } },
    ];

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.APPLICATION_COMPLETE,
      expect.objectContaining({
        rule92: false,
        redirectUrl: '/citizen-hub/1234?lng=en',
        yourApplicationsUrl: '/group-claim-requests-and-applications',
      })
    );
  });

  it('should return error page for Application ID not found', async () => {
    const controller = new StoredApplicationConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should return error page for Latest application not found', async () => {
    const controller = new StoredApplicationConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.appId = '246';

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
