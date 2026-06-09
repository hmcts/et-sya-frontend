import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantClaimTypeDiscriminationController from '../../../../main/controllers/non-hmcts/ClaimantClaimTypeDiscriminationController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { ClaimTypeDiscrimination, TypesOfClaim } from '../../../../main/definitions/definition';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantClaimTypeDiscriminationController', () => {
  const t = {
    'non-hmcts/claimant-claim-type-discrimination': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant claim type discrimination page', () => {
      const controller = new ClaimantClaimTypeDiscriminationController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_CLAIM_TYPE_DISCRIMINATION,
        expect.anything()
      );
    });

    it('should pre-populate form with existing claimTypeDiscrimination values from session', () => {
      const controller = new ClaimantClaimTypeDiscriminationController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { claimTypeDiscrimination: [ClaimTypeDiscrimination.AGE, ClaimTypeDiscrimination.SEX] },
      });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_CLAIM_TYPE_DISCRIMINATION,
        expect.anything()
      );
      expect(request.session.userCase.claimTypeDiscrimination).toContain(ClaimTypeDiscrimination.AGE);
    });
  });

  describe('post()', () => {
    it('should redirect to DESCRIBE_WHAT_HAPPENED on valid single selection (AC3)', async () => {
      const body = { claimTypeDiscrimination: [ClaimTypeDiscrimination.AGE] };
      const controller = new ClaimantClaimTypeDiscriminationController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED);
    });

    it('should allow multiple discrimination types to be selected (AC2)', async () => {
      const body = {
        claimTypeDiscrimination: [
          ClaimTypeDiscrimination.AGE,
          ClaimTypeDiscrimination.DISABILITY,
          ClaimTypeDiscrimination.SEX,
        ],
      };
      const controller = new ClaimantClaimTypeDiscriminationController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should redirect to DESCRIBE_WHAT_HAPPENED for each discrimination type (AC2)', async () => {
      const types = [
        ClaimTypeDiscrimination.DISABILITY,
        ClaimTypeDiscrimination.GENDER_REASSIGNMENT,
        ClaimTypeDiscrimination.MARRIAGE_OR_CIVIL_PARTNERSHIP,
        ClaimTypeDiscrimination.PREGNANCY_OR_MATERNITY,
        ClaimTypeDiscrimination.RACE,
        ClaimTypeDiscrimination.RELIGION_OR_BELIEF,
        ClaimTypeDiscrimination.SEXUAL_ORIENTATION,
      ];

      for (const type of types) {
        const controller = new ClaimantClaimTypeDiscriminationController();
        const req = mockRequestEmpty({ body: { claimTypeDiscrimination: [type] } });
        const res = mockResponse();

        await controller.post(req, res);

        expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED);
      }
    });

    it('should error when no discrimination type is selected (AC2)', async () => {
      const body = { claimTypeDiscrimination: [] as string[] };
      const controller = new ClaimantClaimTypeDiscriminationController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual([{ propertyName: 'claimTypeDiscrimination', errorType: 'required' }]);
    });

    it('should redirect to CLAIMANT_CLAIM_TYPE_PAY when pay related is also selected', async () => {
      const body = { claimTypeDiscrimination: [ClaimTypeDiscrimination.AGE] };
      const controller = new ClaimantClaimTypeDiscriminationController();
      const req = mockRequestEmpty({
        body,
        userCase: { typeOfClaim: [TypesOfClaim.DISCRIMINATION, TypesOfClaim.PAY_RELATED_CLAIM] },
      });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_CLAIM_TYPE_PAY);
    });
  });
});
