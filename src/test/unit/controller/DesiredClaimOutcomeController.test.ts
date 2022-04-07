import DesiredClaimOutcomeController from '../../../main/controllers/DesiredClaimOutcomeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ClaimOutcomes } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Desired Claim Outcome Controller', () => {
  const t = {
    'desired-claim-outcome': {},
    common: {},
  };

  it('should render desired claim outcome page', () => {
    const controller = new DesiredClaimOutcomeController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.DESIRED_CLAIM_OUTCOME, expect.anything());
  });

  describe('post()', () => {
    it('should assign userCase from formData for compensation outcome', () => {
      const body = { claimOutcome: [ClaimOutcomes.OLD_JOB] };

      const controller = new DesiredClaimOutcomeController();
      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.CLAIM_STEPS);
      expect(req.session.userCase).toStrictEqual({
        claimOutcome: [ClaimOutcomes.OLD_JOB],
      });
    });
  });
});
