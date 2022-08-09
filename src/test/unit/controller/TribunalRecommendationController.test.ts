import TribunalRecommendationController from '../../../main/controllers/TribunalRecommendationController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal Recommendation Controller', () => {
  const t = {
    'tribunal-recommendation': {},
    common: {},
  };

  it('should render the tribunal recommendation page', () => {
    const controller = new TribunalRecommendationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_RECOMMENDATION, expect.anything());
  });
});
