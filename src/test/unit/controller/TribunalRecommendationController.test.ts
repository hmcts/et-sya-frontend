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

  describe('Correct validation', () => {
    it('should not require any input', () => {
      const req = mockRequest({ body: {} });
      new TribunalRecommendationController().post(req, mockResponse());

      expect(req.session.errors).toHaveLength(0);
    });

    it('should not allow too long tribunal recommendation text', () => {
      const body = {
        tribunalRecommendationRequest: '1'.repeat(2501),
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new TribunalRecommendationController().post(req, res);

      const expectedErrors = [{ propertyName: 'tribunalRecommendationRequest', errorType: 'tooLong' }];

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should assign userCase from the page form data', () => {
      const req = mockRequest({
        body: { tribunalRecommendationRequest: 'tribunal recommendation text' },
      });
      new TribunalRecommendationController().post(req, mockResponse());

      expect(req.session.userCase).toMatchObject({
        tribunalRecommendationRequest: 'tribunal recommendation text',
      });
    });
  });
});
