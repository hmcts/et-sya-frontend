import TribunalRecommendationOutcomeController from '../../../main/controllers/TribunalRecommendationOutcomeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal Recommendation Outcome Controller', () => {
  const t = {
    'tribunal-recommendation-outcome': {},
    common: {},
  };

  it('should render desired Tribunal Recommendation Outcome page', () => {
    const controller = new TribunalRecommendationOutcomeController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_RECOMMENDATION_OUTCOME, expect.anything());
  });

  describe('post()', () => {
    it('should assign userCase from formData for Tribunal Recommendation Outcome', () => {
      const body = { tribunalRecommendationOutcome: 'test' };

      const controller = new TribunalRecommendationOutcomeController();
      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.PCQ);
      expect(req.session.userCase).toStrictEqual({
        tribunalRecommendationOutcome: 'test',
      });
    });
  });
});
