import ClaimantTribunalRecommendationController from '../../../main/controllers/ClaimantTribunalRecommendationController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantTribunalRecommendationController', () => {
  const t = {
    'claimant-tribunal-recommendation': {},
    common: {},
  };

  it('should render the claimant tribunal recommendation page on GET', () => {
    const controller = new ClaimantTribunalRecommendationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_TRIBUNAL_RECOMMENDATION, expect.anything());
  });

  it('should redirect to CLAIMANT_LINKED_CASES on POST with recommendation text (AC2)', async () => {
    const body = { tribunalRecommendation: 'Implement an equality policy' };
    const controller = new ClaimantTribunalRecommendationController();
    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_LINKED_CASES);
  });

  it('should redirect to CLAIMANT_LINKED_CASES on POST with no input (page is optional, AC2)', async () => {
    const body = {};
    const controller = new ClaimantTribunalRecommendationController();
    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_LINKED_CASES);
  });

  it('should redirect to WHISTLEBLOWING_CLAIMS when whistleblowing is in typeOfClaim', async () => {
    const body = { tribunalRecommendation: 'Implement equality training' };
    const controller = new ClaimantTribunalRecommendationController();
    const req = mockRequest({ body, userCase: { typeOfClaim: [TypesOfClaim.WHISTLE_BLOWING] } });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.WHISTLEBLOWING_CLAIMS);
  });

  it('should pre-populate existing recommendation text on GET', () => {
    const controller = new ClaimantTribunalRecommendationController();
    const response = mockResponse();
    const request = mockRequest({ t, userCase: { tribunalRecommendationRequest: 'Existing recommendation' } });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_TRIBUNAL_RECOMMENDATION, expect.anything());
  });
});
