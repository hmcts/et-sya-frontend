import JudgmentDetailsController from '../../../main/controllers/JudgmentDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, ResponseRequired } from '../../../main/definitions/constants';
import commonRaw from '../../../main/resources/locales/en/translation/common.json';
import judgmentDetailsRaw from '../../../main/resources/locales/en/translation/judgment-details.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Judgment Details Controller', () => {
  const translationJsons = { ...judgmentDetailsRaw, ...commonRaw };

  it('should get judgment details page', () => {
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
    request.url = PageUrls.JUDGMENT_DETAILS;
    request.params.id = '1';

    const controller = new JudgmentDetailsController();
    controller.get(request, response);
    expect(response.render).toBeDefined();
  });
});
