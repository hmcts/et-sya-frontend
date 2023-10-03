import GeneralCorrespondenceNotificationDetailsController from '../../../main/controllers/GeneralCorrespondenceNotificationDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import generalRespondenceRaw from '../../../main/resources/locales/en/translation/general-correspondence-notification-details.json';
import { mockNotificationItem } from '../mocks/mockNotificationItem';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
describe('General correspondence notification details controller', () => {
  const translationJsons = { ...generalRespondenceRaw };

  it('should get general correspondence notification details controller details page', async () => {
    const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockLdClient.mockResolvedValue(true);

    const userCase: Partial<CaseWithId> = {
      sendNotificationCollection: [mockNotificationItem],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);
    request.url = PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS;
    request.params.itemId = '1';

    const generalCorrespondence = {
      id: '1',
      value: {
        sendNotificationCaseManagement: undefined,
        notificationState: 'viewed',
      } as SendNotificationType,
    } as SendNotificationTypeItem;
    request.session.userCase.sendNotificationCollection = [generalCorrespondence];

    const controller = new GeneralCorrespondenceNotificationDetailsController();
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS,
      expect.anything()
    );
  });
});
