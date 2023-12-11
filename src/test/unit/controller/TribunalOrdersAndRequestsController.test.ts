import { TribunalOrdersAndRequestsController } from '../../../main/controllers/TribunalOrdersAndRequestsController';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, Parties, ResponseRequired, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal orders and requests Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');

  const notificationItems: SendNotificationTypeItem[] = [
    {
      value: {
        sendNotificationCaseManagement: 'Case management order',
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
    {
      value: {
        sendNotificationCaseManagement: 'Case management order',
        sendNotificationSelectParties: Parties.CLAIMANT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
        sendNotificationSubjectString: NotificationSubjects.ECC,
      } as SendNotificationType,
    },
  ];

  it('should render tribunal orders and requests page with ECC flag', async () => {
    mockLdClient.mockResolvedValue(true);

    const tribunalOrdersAndRequestsController = new TribunalOrdersAndRequestsController();
    const request = mockRequest({});
    request.session.userCase.sendNotificationCollection = notificationItems;
    const response = mockResponse();

    await tribunalOrdersAndRequestsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_ORDERS_AND_REQUESTS, expect.anything());
  });

  it('should render tribunal orders and requests page without ECC flag', async () => {
    mockLdClient.mockResolvedValue(false);

    const tribunalOrdersAndRequestsController = new TribunalOrdersAndRequestsController();
    const request = mockRequest({});
    request.session.userCase.sendNotificationCollection = notificationItems;
    const response = mockResponse();

    await tribunalOrdersAndRequestsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_ORDERS_AND_REQUESTS, expect.anything());
  });
});
