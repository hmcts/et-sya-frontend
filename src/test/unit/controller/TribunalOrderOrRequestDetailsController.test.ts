import TribunalOrderOrRequestDetailsController from '../../../main/controllers/TribunalOrderOrRequestDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, Parties, ResponseRequired, TranslationKeys } from '../../../main/definitions/constants';
import commonRaw from '../../../main/resources/locales/en/translation/common.json';
import respondentOrderOrRequestDetailsRaw from '../../../main/resources/locales/en/translation/tribunal-order-or-request-details.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respondent order or request details Controller', () => {
  const translationJsons = { ...respondentOrderOrRequestDetailsRaw, ...commonRaw };

  it('should get resondent order or request details page', () => {
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
    request.url = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS;
    request.params.orderId = '1';

    const controller = new TribunalOrderOrRequestDetailsController();
    controller.get(request, response);
    expect(response.render).toBeDefined();
  });
  it('should pass a value to indicate whether a response is required when true', async () => {
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
    request.url = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS;
    request.params.orderId = '1';

    const controller = new TribunalOrderOrRequestDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS,
      expect.objectContaining({
        responseRequired: true,
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
    request.url = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS;
    request.params.orderId = '1';

    const controller = new TribunalOrderOrRequestDetailsController();
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS,
      expect.objectContaining({
        responseRequired: false,
      })
    );
  });
});
