import { TribunalOrdersAndRequestsController } from '../../../main/controllers/TribunalOrdersAndRequestsController';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Parties, ResponseRequired, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respondent orders and requests Controller', () => {
  it('should render Respondent orders and requests page', async () => {
    const notificationItems: SendNotificationTypeItem[] = [
      {
        value: {
          sendNotificationCaseManagement: 'Order',
          sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
          sendNotificationResponseTribunal: ResponseRequired.YES,
        } as SendNotificationType,
      },
      {
        value: {
          sendNotificationCaseManagement: 'Request',
          sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
          sendNotificationResponseTribunal: ResponseRequired.YES,
        } as SendNotificationType,
      },
    ];

    const respondentOrdersAndRequestsController = new TribunalOrdersAndRequestsController();
    const request = mockRequest({});
    request.session.userCase.sendNotificationCollection = notificationItems;
    const response = mockResponse();

    await respondentOrdersAndRequestsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_ORDERS_AND_REQUESTS, expect.anything());
  });
});
