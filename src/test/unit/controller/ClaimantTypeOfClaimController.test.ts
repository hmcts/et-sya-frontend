import ClaimantTypeOfClaimController from '../../../main/controllers/ClaimantTypeOfClaimController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantTypeOfClaimController', () => {
  const t = {
    'claimant-type-of-claim': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant type of claim page (AC1)', () => {
      const controller = new ClaimantTypeOfClaimController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_TYPE_OF_CLAIM, expect.anything());
    });

    it('should pre-populate form with existing typeOfClaim values from session', () => {
      const controller = new ClaimantTypeOfClaimController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL] } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_TYPE_OF_CLAIM, expect.anything());
      expect(request.session.userCase.typeOfClaim).toContain(TypesOfClaim.UNFAIR_DISMISSAL);
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_CLAIM_TYPE_DISCRIMINATION when discrimination is selected (AC1)', async () => {
      const body = { typeOfClaim: [TypesOfClaim.DISCRIMINATION] };
      const controller = new ClaimantTypeOfClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_CLAIM_TYPE_DISCRIMINATION);
    });

    it('should redirect to CLAIM_TYPE_PAY when pay-related is selected without discrimination (AC2)', async () => {
      const body = { typeOfClaim: [TypesOfClaim.PAY_RELATED_CLAIM] };
      const controller = new ClaimantTypeOfClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_TYPE_PAY);
    });

    it('should redirect to DESCRIBE_WHAT_HAPPENED when only unfair dismissal is selected (AC2)', async () => {
      const body = { typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL] };
      const controller = new ClaimantTypeOfClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
    });

    it('should redirect to DESCRIBE_WHAT_HAPPENED when only whistleblowing is selected (AC2)', async () => {
      const body = { typeOfClaim: [TypesOfClaim.WHISTLE_BLOWING] };
      const controller = new ClaimantTypeOfClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
    });

    it('should redirect to DESCRIBE_WHAT_HAPPENED when only other is selected (AC2)', async () => {
      const body = { typeOfClaim: ['other'] };
      const controller = new ClaimantTypeOfClaimController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
    });

    it('should allow multiple selections (AC2)', async () => {
      const body = { typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL, TypesOfClaim.WHISTLE_BLOWING, 'other'] };
      const controller = new ClaimantTypeOfClaimController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should error when no type of claim is selected (AC2)', async () => {
      const body = { typeOfClaim: [] as string[] };
      const controller = new ClaimantTypeOfClaimController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'typeOfClaim', errorType: 'required' }]);
    });

    it('should prioritise discrimination redirect when multiple types including discrimination are selected (AC2)', async () => {
      const body = { typeOfClaim: [TypesOfClaim.DISCRIMINATION, TypesOfClaim.UNFAIR_DISMISSAL] };
      const controller = new ClaimantTypeOfClaimController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_CLAIM_TYPE_DISCRIMINATION);
    });
  });
});
