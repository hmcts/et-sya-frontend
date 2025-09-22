import axios from 'axios';

import TribunalRespondToOrderController from '../../../main/controllers/TribunalRespondToOrderController';
import * as DocumentHelpers from '../../../main/controllers/helpers/DocumentHelpers';
import * as routerHelpers from '../../../main/controllers/helpers/RouterHelpers';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import {
  NoticeOfECC,
  NotificationSubjects,
  PageUrls,
  TranslationKeys,
  languages,
} from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import common from '../../../main/resources/locales/en/translation/common.json';
import respondJsonRaw from '../../../main/resources/locales/en/translation/tribunal-respond-to-order.json';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { safeUrlMock } from '../mocks/mockUrl';
import mockUserCaseComplete, { selectedRequestOrOrder } from '../mocks/mockUserCaseComplete';

jest.mock('axios');
const caseApi = new CaseService.CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);
caseApi.updateSendNotificationState = jest.fn().mockResolvedValue({});

describe('Tribunal Respond to Order Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const t = {
    respondToTribunalOrder: {},
    common: {},
  };

  jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue(safeUrlMock);

  it('should render the Respond to Order page', async () => {
    const translationJsons = { ...respondJsonRaw, ...common };
    const controller = new TribunalRespondToOrderController();
    const userCase: Partial<CaseWithId> = mockUserCaseComplete;
    userCase.selectedRequestOrOrder = selectedRequestOrOrder;

    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase }, translationJsons);
    request.params.orderId = '123';
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, expect.anything());
  });

  it('should post and redirect to the Rule92', () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.NO,
    };

    const controller = new TribunalRespondToOrderController();
    const userCase: Partial<CaseWithId> = mockUserCaseComplete;
    userCase.selectedRequestOrOrder = selectedRequestOrOrder;
    selectedRequestOrOrder.value.sendNotificationSubject = [NotificationSubjects.ORDER_OR_REQUEST];
    userCase.respondents = [
      {
        ccdId: '1',
      },
    ];
    userCase.representatives = [
      {
        respondentId: '1',
        hasMyHMCTSAccount: YesOrNo.YES,
      },
    ];

    const response = mockResponse();
    const request = mockRequest({ t, body, userCase });
    request.session.userCase.sendNotificationCollection = [{ id: '246' }];
    request.params.orderId = '246';

    controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER);
  });

  it('should post and redirect to the Rule92 with non system user', () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.NO,
    };

    const controller = new TribunalRespondToOrderController();
    const userCase: Partial<CaseWithId> = mockUserCaseComplete;
    userCase.selectedRequestOrOrder = selectedRequestOrOrder;
    userCase.respondents = undefined;
    userCase.representatives = undefined;

    const response = mockResponse();
    const request = mockRequest({ t, body, userCase });
    request.session.userCase.sendNotificationCollection = [{ id: '246' }];
    request.params.orderId = '246';

    controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(
      PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should post and redirect to CYA page if request type is CMO, ECC and Notice of ECC', () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.NO,
    };

    const userCase: Partial<CaseWithId> = mockUserCaseComplete;
    userCase.selectedRequestOrOrder = selectedRequestOrOrder;
    selectedRequestOrOrder.id = '1234';
    selectedRequestOrOrder.value.sendNotificationSubject = [
      NotificationSubjects.ORDER_OR_REQUEST,
      NotificationSubjects.ECC,
    ];
    selectedRequestOrOrder.value.sendNotificationEccQuestion = NoticeOfECC;

    const controller = new TribunalRespondToOrderController();
    const response = mockResponse();
    const request = mockRequest({ t, body, userCase });
    request.params.orderId = '1234';
    controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.TRIBUNAL_RESPONSE_CYA + languages.ENGLISH_URL_PARAMETER);
  });

  it('should post and redirect to the supporting material page', () => {
    const body = {
      responseText: 'some Text',
      hasSupportingMaterial: YesOrNo.YES,
    };

    const controller = new TribunalRespondToOrderController();
    const userCase: Partial<CaseWithId> = mockUserCaseComplete;
    userCase.selectedRequestOrOrder = selectedRequestOrOrder;

    const response = mockResponse();
    const request = mockRequest({ t, body, userCase });
    request.session.userCase.sendNotificationCollection = [{ id: '246' }];
    request.params.orderId = '246';

    controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/respondent-supporting-material/246?lng=en');
  });

  it('should post and redirect to the same page when there are errors', () => {
    const body = {
      hasSupportingMaterial: YesOrNo.NO,
    };

    const controller = new TribunalRespondToOrderController();
    const userCase: Partial<CaseWithId> = mockUserCaseComplete;
    userCase.selectedRequestOrOrder = selectedRequestOrOrder;

    const response = mockResponse();
    const request = mockRequest({ t, body, userCase });
    request.session.userCase.sendNotificationCollection = [{ id: '1' }];
    request.params.orderId = '1';

    controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/tribunal-respond-to-order/1?lng=en');
  });

  it('should redirect to error page when not found', () => {
    const body = {
      hasSupportingMaterial: YesOrNo.NO,
    };

    const controller = new TribunalRespondToOrderController();
    const userCase: Partial<CaseWithId> = mockUserCaseComplete;
    userCase.selectedRequestOrOrder = selectedRequestOrOrder;

    const response = mockResponse();
    const request = mockRequest({ t, body, userCase });
    request.params.orderId = '1';

    controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/not-found?lng=en');
  });

  it('should redirect to /not-found when getDocumentsAdditionalInformation throws an error', async () => {
    const getDocumentsAdditionalInformationSpy = jest
      .spyOn(DocumentHelpers, 'getDocumentsAdditionalInformation')
      .mockRejectedValue(new Error('Document service error'));

    const translationJsons = { ...respondJsonRaw, ...common };
    const controller = new TribunalRespondToOrderController();

    const mockSelectedRequestOrOrder = {
      id: '999',
      value: {
        number: '1',
        sendNotificationTitle: 'title',
        sendNotificationSubjectString: 'Order or request',
        sendNotificationSelectHearing: {
          selectedLabel: 'Hearing',
        },
        date: '2019-05-03',
        sentBy: 'Tribunal',
        sendNotificationCaseManagement: 'Order',
        sendNotificationResponseTribunal: 'required',
        sendNotificationSelectParties: 'Both',
        sendNotificationAdditionalInfo: 'additional info',
        sendNotificationWhoCaseOrder: 'Legal officer',
        sendNotificationFullName: 'Judge Dredd',
        sendNotificationNotify: 'Both',
        notificationState: 'notViewedYet',
        sendNotificationUploadDocument: [
          {
            id: '1',
            value: {
              typeOfDocument: 'ACAS Certificate',
              uploadedDocument: {
                document_binary_url: 'http://dm-store:8080/documents/test.pdf/binary',
                document_filename: 'test.pdf',
                document_url: 'http://dm-store:8080/documents/test.pdf',
              },
            },
          },
        ],
      },
    };

    const userCase: Partial<CaseWithId> = {
      ...mockUserCaseComplete,
      selectedRequestOrOrder: mockSelectedRequestOrOrder,
      sendNotificationCollection: [mockSelectedRequestOrOrder],
    };

    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase }, translationJsons);
    request.params.orderId = '999';
    request.session.userCase.sendNotificationCollection = [mockSelectedRequestOrOrder];

    await controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/not-found');
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, expect.anything());

    getDocumentsAdditionalInformationSpy.mockRestore();
  });
});
