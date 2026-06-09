import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantNoAcasNumberController from '../../../../main/controllers/non-hmcts/ClaimantNoAcasNumberController';
import { NoAcasNumberReason } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantNoAcasNumberController', () => {
  const t = {
    'non-hmcts/claimant-no-acas-reason': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant no ACAS reason page (AC2)', () => {
      const controller = new ClaimantNoAcasNumberController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NO_ACAS_NUMBER, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to EMPLOYMENT_RESPONDENT_TASK_CHECK when a reason is selected (AC3)', async () => {
      const body = { noAcasReason: NoAcasNumberReason.ANOTHER };
      const controller = new ClaimantNoAcasNumberController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_DETAILS_CHECK);
    });

    it('should redirect to EMPLOYMENT_RESPONDENT_TASK_CHECK for unfair dismissal reason (AC3)', async () => {
      const body = { noAcasReason: NoAcasNumberReason.UNFAIR_DISMISSAL };
      const controller = new ClaimantNoAcasNumberController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_DETAILS_CHECK);
    });

    it('should save the selected reason to the respondent in session (AC2)', async () => {
      const body = { noAcasReason: NoAcasNumberReason.EMPLOYER };
      const controller = new ClaimantNoAcasNumberController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.respondents[0].noAcasReason).toEqual(NoAcasNumberReason.EMPLOYER);
    });

    it('should stay on page with error when no reason is selected (AC2)', async () => {
      const body = {};
      const controller = new ClaimantNoAcasNumberController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();
      req.url = PageUrls.CLAIMANT_NO_ACAS_NUMBER;

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NO_ACAS_NUMBER);
      expect(req.session.errors.some((e: any) => e.propertyName === 'noAcasReason')).toBe(true);
    });
  });
});
