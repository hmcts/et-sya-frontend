import TribunalOrderOrRequestDetailsController from '../../../main/controllers/TribunalOrderOrRequestDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, Parties, ResponseRequired } from '../../../main/definitions/constants';
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
});
