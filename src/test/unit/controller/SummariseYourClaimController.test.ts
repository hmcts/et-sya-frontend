import SummariseYourClaimController from '../../../main/controllers/SummariseYourClaimController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Summarise Your Claim Controller', () => {
  const t = {
    'summarise-your-claim': {},
    common: {},
  };

  it('should render summarise your claim page', () => {
    const controller = new SummariseYourClaimController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.SUMMARISE_YOUR_CLAIM, expect.anything());
  });

  describe('post()', () => {
    it('should assign userCase from formData for Summarise Your Claim Outcome', () => {
      const body = { claimSummaryText: 'test', claimSummaryFile: 'testFile.txt' };

      const controller = new SummariseYourClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.DESIRED_CLAIM_OUTCOME);
      expect(req.session.userCase).toStrictEqual({
        claimSummaryText: 'test',
        claimSummaryFile: 'testFile.txt',
      });
    });
  });
});
