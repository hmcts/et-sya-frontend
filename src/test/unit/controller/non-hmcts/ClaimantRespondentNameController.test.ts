import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantRespondentNameController from '../../../../main/controllers/non-hmcts/ClaimantRespondentNameController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantRespondentNameController', () => {
  const t = {
    'claimant-respondent-name': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant respondent name page', () => {
      const controller = new ClaimantRespondentNameController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_RESPONDENT_NAME, expect.anything());
    });

    it('should pre-populate form with existing respondent name from session', () => {
      const controller = new ClaimantRespondentNameController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { respondents: [{ respondentName: 'Acme Ltd', respondentNumber: 1 }] },
      });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_RESPONDENT_NAME, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_RESPONDENT_POSTCODE_ENTER on valid name (AC2)', async () => {
      const body = { respondentName: 'Acme Ltd' };
      const controller = new ClaimantRespondentNameController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_POSTCODE_ENTER);
    });

    it('should set respondentNumber to 1 before saving', async () => {
      const body = { respondentName: 'Acme Ltd' };
      const controller = new ClaimantRespondentNameController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.params.respondentNumber).toEqual('1');
    });

    it('should stay on page and error when respondent name is empty', async () => {
      const body = { respondentName: '' };
      const controller = new ClaimantRespondentNameController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors.some((e: any) => e.propertyName === 'respondentName')).toBe(true);
    });
  });
});
