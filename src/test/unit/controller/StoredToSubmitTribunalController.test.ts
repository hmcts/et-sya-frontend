import AxiosInstance, { AxiosResponse } from 'axios';

import StoredToSubmitTribunalController from '../../../main/controllers/StoredToSubmitTribunalController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { SendNotificationTypeItem } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import applicationDetailsJsonRaw from '../../../main/resources/locales/en/translation/application-details.json';
import tribunalRespondToOrderJsonRaw from '../../../main/resources/locales/en/translation/tribunal-respond-to-order.json';
import tribunalResponseCyaJsonRaw from '../../../main/resources/locales/en/translation/tribunal-response-cya.json';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const sendNotificationTypeItems: SendNotificationTypeItem[] = [
  {
    id: '234',
    value: {
      date: '2022-05-05',
      respondStoredCollection: [
        {
          id: '567',
          value: {
            from: 'Claimant',
            copyToOtherParty: 'Yes',
            date: '06 Oct 2023',
            response: 'Test response',
          },
        },
      ],
    },
  },
];

const userCase: Partial<CaseWithId> = {
  id: '123',
  sendNotificationCollection: sendNotificationTypeItems,
};

const controller = new StoredToSubmitTribunalController();

describe('Stored to Submit Tribunal Controller GET', () => {
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

  it('should render the stored to submit page', async () => {
    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.STORED_TO_SUBMIT,
      expect.objectContaining({
        title: 'Respond to the tribunal',
        viewCorrespondenceLink: '/tribunal-order-or-request-details/234?lng=en',
        cancelLink: '/citizen-hub/123?lng=en',
      })
    );
  });

  it('should return error page for Selected response not found', async () => {
    req.params.responseId = 'Test';
    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });

  it('should return error page for Selected send notification not found', async () => {
    req.params.orderId = 'Test';
    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});

describe('Stored to Submit Tribunal Controller POST', () => {
  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    storedToSubmitRespondToTribunal: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

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

  it('should redirect to update page when yes is selected', async () => {
    const body = { confirmCopied: YesOrNo.YES };
    const req = mockRequest({ body, session: { userCase } });
    const res = mockResponse();
    req.params.orderId = '234';
    req.params.responseId = '567';
    req.url = '/stored-to-submit-tribunal/234/567?lng=en';
    req.session.userCase.sendNotificationCollection = [
      { id: '234', value: { respondStoredCollection: [{ id: '567', value: {} }] } },
    ];
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
    req.params.orderId = '234';
    req.params.responseId = '567';
    req.url = '/stored-to-submit-response/234/567?lng=en';
    req.session.userCase.sendNotificationCollection = [
      { id: '234', value: { respondStoredCollection: [{ id: '567', value: {} }] } },
    ];
    req.session.errors = [];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/stored-to-submit-response/234/567?lng=en');
    expect(req.session.errors).toEqual(errors);
  });
});

describe('Stored to Submit Tribunal Controller POST return error page', () => {
  const body = { confirmCopied: YesOrNo.YES };
  const req = mockRequest({ body, session: { userCase } });
  const res = mockResponse();
  req.params.orderId = '234';
  req.url = '/stored-to-submit-tribunal/234/567?lng=en';
  req.session.userCase.hubLinksStatuses = new HubLinksStatuses();
  req.session.userCase.selectedRequestOrOrder = sendNotificationTypeItems[0];

  it('should render the same page when nothing is selected', async () => {
    jest.mock('axios');
    const mockCaseApi = {
      axios: AxiosInstance,
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
