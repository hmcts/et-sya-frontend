import axios from 'axios';

import NoAcasNumberController from '../../../main/controllers/NoAcasNumberController';
import { NoAcasNumberReason } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockLogger } from '../mocks/mockLogger';
import { mockRequest, mockRequestWithSaveException } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('No Acas number Controller', () => {
  const t = {
    noAcasReason: {},
    common: {},
  };

  it('should render the no acas cert controller page', () => {
    const controller = new NoAcasNumberController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NO_ACAS_NUMBER, expect.anything());
  });

  it('should redirect to respondent details check when an answer is selected', () => {
    const body = { noAcasReason: NoAcasNumberReason.ANOTHER };

    const controller = new NoAcasNumberController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_DETAILS_CHECK);
  });
  it('should redirect to your claim has been saved page and save respondent details when an answer is selected and save as draft clicked', () => {
    const body = { noAcasReason: NoAcasNumberReason.ANOTHER, saveForLater: true };

    const controller = new NoAcasNumberController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });
  it('should redirect to your claim has been saved page when save as draft clicked and no acas reason selected', () => {
    const body = { saveForLater: true };

    const controller = new NoAcasNumberController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });
  it('should redirect to undefined when save as draft not clicked and no acas reason selected', () => {
    const body = { saveForLater: false };

    const controller = new NoAcasNumberController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
  });
  it('should redirect to undefined when save as draft not selected and no acas reason selected', () => {
    const body = {};

    const controller = new NoAcasNumberController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
  });
  it('should throw error, when session errors exists and unable to save session', () => {
    const body = { saveForLater: false };

    const controller = new NoAcasNumberController(mockLogger);
    const err = new Error('Something went wrong');

    const req = mockRequestWithSaveException({
      body,
    });
    const res = mockResponse();
    expect(function () {
      controller.post(req, res);
    }).toThrow(err);
  });

  it('should add no acas number reason to the session userCase', () => {
    const body = { noAcasReason: NoAcasNumberReason.ANOTHER };
    const controller = new NoAcasNumberController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(req.session.userCase.respondents[0].noAcasReason).toStrictEqual(NoAcasNumberReason.ANOTHER);
    expect(req.session.userCase.respondents[0].respondentNumber).toStrictEqual(1);
  });

  it('should run logger in catch block', async () => {
    const body = { noAcasReason: NoAcasNumberReason.ANOTHER };
    const controller = new NoAcasNumberController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toHaveBeenCalled());
  });
});
