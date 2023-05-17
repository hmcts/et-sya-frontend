import { GeneralCorrespondenceListController } from '../../../main/controllers/GeneralCorrespondenceListController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockNotificationItem } from '../mocks/mockNotificationItem';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('General correspondence list controller', () => {
  it('should render Respondent orders and requests page', async () => {
    const notificationItems = [mockNotificationItem];

    const generalCorrespondenceListController = new GeneralCorrespondenceListController();
    const request = mockRequest({});
    request.session.userCase.sendNotificationCollection = notificationItems;
    const response = mockResponse();

    await generalCorrespondenceListController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.GENERAL_CORRESPONDENCE_LIST, expect.anything());
  });
});
