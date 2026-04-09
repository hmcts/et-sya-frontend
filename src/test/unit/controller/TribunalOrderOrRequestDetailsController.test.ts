import TribunalOrderOrRequestDetailsController from '../../../main/controllers/TribunalOrderOrRequestDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, Parties, ResponseRequired, TranslationKeys } from '../../../main/definitions/constants';
import { HubLinkStatus } from '../../../main/definitions/hub';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import commonRaw from '../../../main/resources/locales/en/translation/common.json';
import respondentOrderOrRequestDetailsRaw from '../../../main/resources/locales/en/translation/notification-details.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Respondent order or request details Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const translationJsons = { ...respondentOrderOrRequestDetailsRaw, ...commonRaw };

  it('should get resondent order or request details page', async () => {
    const userCase: Partial<CaseWithId> = {
      sendNotificationCollection: [
        {
          id: '1',
          value: {
            sendNotificationCaseManagement: 'Order',
            sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
            sendNotificationResponseTribunal: ResponseRequired.YES,
            sendNotificationTitle: 'test',
          } as SendNotificationType,
        },
      ],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);
    request.url = PageUrls.NOTIFICATION_DETAILS;
    request.params.orderId = '1';

    const controller = new TribunalOrderOrRequestDetailsController();
    await controller.get(request, response);
    expect(response.render).toBeDefined();
  });

  it("should pass a value for 'respondButton' to indicate a response is required when true", async () => {
    const userCase: Partial<CaseWithId> = {
      sendNotificationCollection: [
        {
          id: '1',
          value: {
            sendNotificationCaseManagement: 'Order',
            sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
            sendNotificationResponseTribunal: ResponseRequired.YES,
            sendNotificationTitle: 'test',
            notificationState: HubLinkStatus.NOT_STARTED_YET,
          } as SendNotificationType,
        },
      ],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);
    request.url = PageUrls.NOTIFICATION_DETAILS;
    request.params.orderId = '1';

    const controller = new TribunalOrderOrRequestDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.NOTIFICATION_DETAILS,
      expect.objectContaining({
        respondButton: true,
      })
    );
  });

  it('should pass a value to indicate whether a response is required when false', async () => {
    const userCase: Partial<CaseWithId> = {
      sendNotificationCollection: [
        {
          id: '1',
          value: {
            sendNotificationCaseManagement: 'Order',
            sendNotificationResponseTribunal: 'No',
            sendNotificationTitle: 'test',
          } as SendNotificationType,
        },
      ],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);
    request.url = PageUrls.NOTIFICATION_DETAILS;
    request.params.orderId = '1';

    const controller = new TribunalOrderOrRequestDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.NOTIFICATION_DETAILS,
      expect.objectContaining({
        respondButton: false,
      })
    );
  });

  it('should redirect error page when appId invalid', async () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase: mockUserCase }, translationJsons);
    request.params.orderId = 'invalid-order-id';

    await new TribunalOrderOrRequestDetailsController().get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/not-found?lng=en');
  });
});
