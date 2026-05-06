import DidClaimantWorkForEmployerController from '../../../main/controllers/DidClaimantWorkForEmployerController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('DidClaimantWorkForEmployerController', () => {
  const t = {
    'did-claimant-work-for-employer': {},
    common: {},
  };

  it('should render the did claimant work for employer page', () => {
    const controller = new DidClaimantWorkForEmployerController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.DID_CLAIMANT_WORK_FOR_EMPLOYER, expect.anything());
  });

  it('should redirect to FIRST_RESPONDENT_NAME when No is selected', async () => {
    const body = { pastEmployer: YesOrNo.NO };
    const controller = new DidClaimantWorkForEmployerController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.FIRST_RESPONDENT_NAME);
  });

  it('should redirect to IS_CLAIMANT_STILL_WORKING when Yes is selected', async () => {
    const body = { pastEmployer: YesOrNo.YES };
    const controller = new DidClaimantWorkForEmployerController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.IS_CLAIMANT_STILL_WORKING);
  });

  it('should redirect to FIRST_RESPONDENT_NAME when no value is submitted', async () => {
    const body = { pastEmployer: '' };
    const controller = new DidClaimantWorkForEmployerController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.FIRST_RESPONDENT_NAME);
  });

  it('should save pastEmployer to session userCase', async () => {
    const body = { pastEmployer: YesOrNo.YES };
    const controller = new DidClaimantWorkForEmployerController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({ pastEmployer: YesOrNo.YES });
  });
});
