import AllJudgmentsController from '../../../main/controllers/AllJudgmentsController';
import { CaseWithId } from '../../../main/definitions/case';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, ResponseRequired } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import allJudgmentsRaw from '../../../main/resources/locales/en/translation/all-judgments.json';
import commonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('All Judgments Controller', () => {
  const translationJsons = { ...allJudgmentsRaw, ...commonRaw };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should get all judgments page', async () => {
    const userCase: Partial<CaseWithId> = {
      sendNotificationCollection: [
        {
          id: '1',
          value: {
            sendNotificationSubjectString: 'Judgment',
            sendNotificationResponseTribunal: ResponseRequired.YES,
            sendNotificationTitle: 'test',
          } as SendNotificationType,
        },
      ],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase }, translationJsons);
    request.url = PageUrls.ALL_JUDGMENTS;
    request.params.id = '1';

    const controller = new AllJudgmentsController();
    await controller.get(request, response);
    expect(response.render).toBeDefined();
  });
});
