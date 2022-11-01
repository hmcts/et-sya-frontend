import axios from 'axios';

import WorkAddressController from '../../../main/controllers/WorkAddressController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockLogger } from '../mocks/mockLogger';
import { mockRequest, mockRequestWithSaveException } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Update Work Address Controller', () => {
  const t = {
    session: {
      params: {
        respondentNumber: '1',
      },
    },
    claimantWorkAddressQuestion: {},
    common: {},
  };

  it('should render the Work Address page', () => {
    const controller = new WorkAddressController(mockLogger);
    const response = mockResponse();
    const req = <AppRequest>mockRequest({ t });

    req.session.userCase = userCaseWithRespondent;

    controller.get(req, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.WORK_ADDRESS, expect.anything());
  });

  it('should redirect to acas cert num page when yes is selected', () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.YES };

    const controller = new WorkAddressController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1/acas-cert-num');
    // TODO Test respondent address is copied to work address
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual('Yes');
  });

  it('should redirect to place of work page when no is selected', () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.NO };

    const controller = new WorkAddressController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1/place-of-work');
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual('No');
  });
  it('should redirect to your claim has been saved page (English language) page when the current language is English, save respondent details when an answer is selected and save as draft clicked', () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.NO, saveForLater: true };

    const controller = new WorkAddressController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;
    req.url = PageUrls.WORK_ADDRESS + languages.ENGLISH_URL_PARAMETER;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to your claim has been saved page (Welsh language) page when the current language is Welsh and save as draft clicked and no answer selected', () => {
    const body = { saveForLater: true };

    const controller = new WorkAddressController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;
    req.url = PageUrls.WORK_ADDRESS + languages.WELSH_URL_PARAMETER;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED + languages.WELSH_URL_PARAMETER);
  });

  it('should redirect to your claim has been saved (English language) page when the current language is English, save as draft clicked and no answer selected', () => {
    const body = { saveForLater: true };

    const controller = new WorkAddressController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;
    req.url = PageUrls.WORK_ADDRESS + languages.ENGLISH_URL_PARAMETER;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED + languages.ENGLISH_URL_PARAMETER);
  });
  it('should redirect to undefined when save as draft not clicked and no answer selected', () => {
    const body = { saveForLater: false };

    const controller = new WorkAddressController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual(YesOrNo.NO);
  });
  it('should redirect to undefined when save as draft not selected and no answer', () => {
    const body = {};

    const controller = new WorkAddressController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual(YesOrNo.NO);
  });
  it('should throw error, when session errors exists and unable to save session', () => {
    const body = { saveForLater: false };

    const controller = new WorkAddressController(mockLogger);
    const err = new Error('Something went wrong');

    const req = mockRequestWithSaveException({
      body,
    });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;
    expect(function () {
      controller.post(req, res);
    }).toThrow(err);
  });

  it('should add work address question answer to the session userCase', () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.NO };
    const controller = new WorkAddressController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual(YesOrNo.NO);
  });

  it('should run logger in catch block', async () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.NO };
    const controller = new WorkAddressController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toHaveBeenCalled());
  });
});
