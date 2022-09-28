import axios from 'axios';

import AcasCertNumController from '../../../main/controllers/AcasCertNumController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockLogger } from '../mocks/mockLogger';
import { mockRequest, mockRequestWithSaveException } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Acas Cert Num Controller', () => {
  const t = {
    acasCert: {},
    common: {},
  };

  it('should render the acas cert num controller page', () => {
    const controller = new AcasCertNumController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ACAS_CERT_NUM, expect.anything());
  });

  it('should redirect to respondent details check when yes is selected', () => {
    const body = { acasCert: YesOrNo.YES, acasCertNum: 'R123453/121' };

    const controller = new AcasCertNumController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_DETAILS_CHECK);
  });

  it('should redirect to no acas number reason when no is selected and remove acas cert num value', () => {
    const body = { acasCert: YesOrNo.NO, saveForLater: false };

    const controller = new AcasCertNumController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1' + PageUrls.NO_ACAS_NUMBER);
    expect(req.session.userCase.respondents[0].acasCertNum).toEqual(undefined);
    expect(req.session.userCase.respondents[0].acasCert).toEqual(YesOrNo.NO);
  });

  it('should redirect to no acas number reason when nothing is selected and save and continue clicked then should remove acasCertNum and should redirect PageUrls.ACAS_CERT_NUM', () => {
    const body = { saveForLater: false };

    const controller = new AcasCertNumController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
    expect(req.session.userCase.respondents[0].acasCertNum).toEqual(undefined);
    expect(req.session.userCase.respondents[0].acasCert).toEqual(undefined);
  });

  it('should redirect to your claim has been saved page when save as draft selected', () => {
    const body = { acasCert: YesOrNo.NO, saveForLater: true };

    const controller = new AcasCertNumController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should redirect to your-claim-has-been-saved page when save as draft selected, acasCert is Yes and No acas certificate number entered', () => {
    const body = { acasCert: YesOrNo.YES, saveForLater: true };

    const controller = new AcasCertNumController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should throw error, when session errors exists and unable to save session', () => {
    const body = { acasCert: YesOrNo.YES, saveForLater: false };

    const controller = new AcasCertNumController(mockLogger);
    const err = new Error('Something went wrong');

    const req = mockRequestWithSaveException({
      body,
    });
    const res = mockResponse();
    expect(function () {
      controller.post(req, res);
    }).toThrow(err);
  });

  it('should add acas number to the session userCase', () => {
    const body = { acasCert: YesOrNo.YES, acasCertNum: 'R123453/121' };
    const controller = new AcasCertNumController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(req.session.userCase.respondents[0].acasCertNum).toEqual('R123453/121');
    expect(req.session.userCase.respondents[0].acasCert).toEqual(YesOrNo.YES);
  });

  it('should run logger in catch block', async () => {
    const body = { acasCert: YesOrNo.YES, acasCertNum: 'R123453/121' };
    const controller = new AcasCertNumController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toHaveBeenCalled());
  });
});
