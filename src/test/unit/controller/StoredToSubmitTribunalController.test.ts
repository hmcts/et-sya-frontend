import AxiosInstance, { AxiosResponse } from 'axios';

import StoredToSubmitTribunalController from '../../../main/controllers/StoredToSubmitTribunalController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { SendNotificationTypeItem } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import applicationDetailsJsonRaw from '../../../main/resources/locales/en/translation/application-details.json';
import tribunalRespondToOrderJsonRaw from '../../../main/resources/locales/en/translation/tribunal-respond-to-order.json';
import tribunalResponseCyaJsonRaw from '../../../main/resources/locales/en/translation/tribunal-response-cya.json';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const mockCaseApi = {
  axios: AxiosInstance,
  updateHubLinksStatuses: jest.fn(),
  storedToSubmitRespondToTribunal: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

const sendNotificationTypeItems: SendNotificationTypeItem[] = [
  {
    id: '234',
    value: {
      date: '2022-05-05',
      respondCollection: [
        {
          id: '567',
          value: {
            from: 'Claimant',
            status: 'Stored',
            copyToOtherParty: 'Yes',
            date: '06 Oct 2023',
            response: 'Test response',
          },
        },
      ],
    },
  },
];

describe('Stored to Submit Tribunal Controller', () => {
  const controller = new StoredToSubmitTribunalController();

  caseApi.updateDraftCase = jest.fn().mockResolvedValue(
    Promise.resolve({
      data: {
        created_date: '2022-08-19T09:19:25.79202',
        last_modified: '2022-08-19T09:19:25.817549',
        case_data: {
          sendNotificationCollection: sendNotificationTypeItems,
        },
      },
    } as AxiosResponse<CaseApiDataResponse>)
  );

  const userCase: Partial<CaseWithId> = {
    id: '123',
    sendNotificationCollection: sendNotificationTypeItems,
  };

  it('should render the stored to submit page', async () => {
    const translationJsons = {
      ...tribunalRespondToOrderJsonRaw,
      ...applicationDetailsJsonRaw,
      ...tribunalResponseCyaJsonRaw,
    };
    const res = mockResponse();
    const req = mockRequestWithTranslation({ session: { userCase } }, translationJsons);
    req.params.orderId = '234';
    req.params.responseId = '567';
    req.url = '/stored-to-submit-tribunal/234/567?lng=en';

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.STORED_TO_SUBMIT,
      expect.objectContaining({
        applicationType: 'Respond to the tribunal',
        viewCorrespondenceLink: '/tribunal-order-or-request-details/234?lng=en',
        cancelLink: '/citizen-hub/123?lng=en',
      })
    );
  });

  it('should redirect to update page when yes is selected', async () => {
    const body = { confirmCopied: YesOrNo.YES };
    const req = mockRequest({ body, session: { userCase } });
    const res = mockResponse();
    req.params.orderId = '234';
    req.url = '/stored-to-submit-tribunal/234/567?lng=en';
    req.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    req.session.userCase.selectedRequestOrOrder = sendNotificationTypeItems[0];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.APPLICATION_COMPLETE + languages.ENGLISH_URL_PARAMETER);
  });

  it('should render the same page when nothing is selected', async () => {
    const errors = [{ propertyName: 'confirmCopied', errorType: 'required' }];
    const body = { continue: true };
    const req = mockRequest({ body });
    const res = mockResponse();
    req.url = '/stored-to-submit-response/234/567?lng=en';
    req.session.errors = [];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/stored-to-submit-response/234/567?lng=en');
    expect(req.session.errors).toEqual(errors);
  });
});
