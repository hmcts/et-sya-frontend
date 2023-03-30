import TribunalOrderOrRequestDetailsController from '../../../main/controllers/TribunalOrderOrRequestDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Parties, ResponseRequired, TranslationKeys } from '../../../main/definitions/constants';
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
          value: {
            sendNotificationCaseManagement: 'Order',
            sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
            sendNotificationResponseTribunal: ResponseRequired.YES,
          } as SendNotificationType,
        },
      ],
    };
    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);

    const controller = new TribunalOrderOrRequestDetailsController();
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS,
      expect.anything()
    );
  });
});
