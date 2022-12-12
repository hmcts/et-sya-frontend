import NoAcasNumberController from '../../../main/controllers/NoAcasNumberController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { NoAcasNumberReason } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
describe('No Acas number Controller', () => {
  const t = {
    noAcasReason: {},
    common: {},
  };

  it('should render the no acas cert controller page', () => {
    const controller = new NoAcasNumberController();

    const response = mockResponse();
    const request = mockRequest({ t });

    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NO_ACAS_NUMBER, expect.anything());
  });

  it('should redirect to respondent details check when an answer is selected', async () => {
    const body = { noAcasReason: NoAcasNumberReason.ANOTHER };

    const controller = new NoAcasNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_DETAILS_CHECK);
  });
  it('should redirect to your claim has been saved page and save respondent details when an answer is selected and save as draft clicked', async () => {
    const body = { noAcasReason: NoAcasNumberReason.ANOTHER, saveForLater: true };

    const controller = new NoAcasNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });
  it('should redirect to your claim has been saved page when save as draft clicked and no acas reason selected', async () => {
    const body = { saveForLater: true };

    const controller = new NoAcasNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });
  it('should redirect to undefined when save as draft not clicked and no acas reason selected', async () => {
    const body = { saveForLater: false };

    const controller = new NoAcasNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
  });
  it('should redirect to undefined when save as draft not selected and no acas reason selected', async () => {
    const body = {};

    const controller = new NoAcasNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
  });

  // it('should throw error, when session errors exists and unable to save session', () => {
  //   const body = { saveForLater: false };

  //   const controller = new NoAcasNumberController();
  //   const err = new Error('Something went wrong');

  //   const req = mockRequestWithSaveException({
  //     body,
  //   });
  //   const res = mockResponse();
  //   expect(async function () {
  //     await controller.post(req, res);
  //   }).toThrow(err);
  // });

  it('should add no acas number reason to the session userCase', async () => {
    const body = { noAcasReason: NoAcasNumberReason.ANOTHER };
    const controller = new NoAcasNumberController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);
    expect(req.session.userCase.respondents[0].noAcasReason).toStrictEqual(NoAcasNumberReason.ANOTHER);
    expect(req.session.userCase.respondents[0].respondentNumber).toStrictEqual(1);
  });
});
