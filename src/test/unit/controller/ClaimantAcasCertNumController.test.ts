import ClaimantAcasCertNumController from '../../../main/controllers/ClaimantAcasCertNumController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantAcasCertNumController', () => {
  const t = {
    'claimant-acas-cert-num': {},
    common: {},
  };

  const respondent = {
    respondentNumber: 1,
    respondentName: 'Acme Ltd',
  };

  describe('get()', () => {
    it('should render the claimant ACAS certificate page (AC1)', () => {
      const controller = new ClaimantAcasCertNumController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_ACAS_CERT_NUM, expect.anything());
    });

    it('should pass respondent name to the view from session (AC1)', () => {
      const controller = new ClaimantAcasCertNumController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { respondents: [respondent] } });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.respondentName).toEqual('Acme Ltd');
    });

    it('should pass empty respondent name when no respondents in session', () => {
      const controller = new ClaimantAcasCertNumController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.respondentName).toEqual('');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_RESPONDENT_DETAILS_CHECK when Yes is selected with cert number (AC2)', async () => {
      const body = { acasCert: YesOrNo.YES, acasCertNum: 'R123456/12/34' };
      const controller = new ClaimantAcasCertNumController();
      const req = mockRequest({ body, userCase: { respondents: [respondent] } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_DETAILS_CHECK);
    });

    it('should save acas cert number to respondent in session (AC2)', async () => {
      const body = { acasCert: YesOrNo.YES, acasCertNum: 'R123456/12/34' };
      const controller = new ClaimantAcasCertNumController();
      const req = mockRequest({ body, userCase: { respondents: [respondent] } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.respondents[0].acasCertNum).toEqual('R123456/12/34');
      expect(req.session.userCase.respondents[0].acasCert).toEqual(YesOrNo.YES);
    });

    it('should redirect to CLAIMANT_NO_ACAS_NUMBER when No is selected (AC2)', async () => {
      const body = { acasCert: YesOrNo.NO };
      const controller = new ClaimantAcasCertNumController();
      const req = mockRequest({ body, userCase: { respondents: [respondent] } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NO_ACAS_NUMBER);
    });

    it('should stay on page with error when no answer is given', async () => {
      const body = {};
      const controller = new ClaimantAcasCertNumController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();
      req.url = PageUrls.CLAIMANT_ACAS_CERT_NUM;

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_ACAS_CERT_NUM);
      expect(req.session.errors.some((e: any) => e.propertyName === 'acasCert')).toBe(true);
    });
  });
});
