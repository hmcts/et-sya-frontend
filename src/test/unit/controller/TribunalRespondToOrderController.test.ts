import axios from 'axios';

import TribunalRespondToOrderController from '../../../main/controllers/TribunalRespondToOrderController';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import common from '../../../main/resources/locales/en/translation/common.json';
import respondJsonRaw from '../../../main/resources/locales/en/translation/tribunal-respond-to-order.json';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCaseComplete, { selectedRequestOrOrder } from '../mocks/mockUserCaseComplete';

jest.mock('axios');
const caseApi = new CaseService.CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);
caseApi.updateSendNotificationState = jest.fn().mockResolvedValue({});

describe('Tribunal Respond to Order Controller', () => {
  const t = {
    respondToTribunalOrder: {},
    common: {},
  };

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
    controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(
      PageUrls.COPY_TO_OTHER_PARTY + TranslationKeys.ENGLISH_URL_PARAMETER
    );
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
    controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(
      PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER + TranslationKeys.ENGLISH_URL_PARAMETER
    );
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
    request.params.orderId = '1';
    controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/respondent-supporting-material/1?lng=en');
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
    request.params.orderId = '1';
    controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/tribunal-respond-to-order/1?lng=en');
  });
});
