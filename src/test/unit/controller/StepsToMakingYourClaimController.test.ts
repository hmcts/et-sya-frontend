import StepsToMakingYourClaimController from '../../../main/controllers/StepsToMakingYourClaimController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { mockSession } from '../mocks/mockApp';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const stepsToMakingYourClaimController = new StepsToMakingYourClaimController();

// All page includes links there is no redirect page that is why did not check
// response.redirect

describe('Steps to Making your claim Controller', () => {
  it('should render single or multiple claim page', () => {
    const response = mockResponse();
    const request = mockRequest({ session: mockSession([TypesOfClaim.DISCRIMINATION], []) });
    stepsToMakingYourClaimController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, expect.anything());
  });

  it('should render page with claim type DISCRIMINATION', () => {
    const response = mockResponse();
    const request = mockRequest({ session: mockSession([TypesOfClaim.DISCRIMINATION], []) });
    stepsToMakingYourClaimController.get(request, response);
    expect(request.session.userCase.typeOfClaim).toEqual([TypesOfClaim.DISCRIMINATION]);
  });

  it('should render page with claim type UNFAIR_DISMISSAL', () => {
    const response = mockResponse();
    const request = mockRequest({ session: mockSession([TypesOfClaim.UNFAIR_DISMISSAL], []) });
    stepsToMakingYourClaimController.get(request, response);
    expect(request.session.userCase.typeOfClaim).toEqual([TypesOfClaim.UNFAIR_DISMISSAL]);
  });

  it('should render page with claim type PAY_RELATED_CLAIM', () => {
    const response = mockResponse();
    const request = mockRequest({ session: mockSession([TypesOfClaim.PAY_RELATED_CLAIM], []) });
    stepsToMakingYourClaimController.get(request, response);
    expect(request.session.userCase.typeOfClaim).toEqual([TypesOfClaim.PAY_RELATED_CLAIM]);
  });

  it('should render page with all claim types', () => {
    const response = mockResponse();
    const request = mockRequest({
      session: mockSession(
        [
          TypesOfClaim.PAY_RELATED_CLAIM,
          TypesOfClaim.DISCRIMINATION,
          TypesOfClaim.BREACH_OF_CONTRACT,
          TypesOfClaim.UNFAIR_DISMISSAL,
          TypesOfClaim.WHISTLE_BLOWING,
          TypesOfClaim.OTHER_TYPES,
        ],
        []
      ),
    });
    stepsToMakingYourClaimController.get(request, response);
    expect(request.session.userCase.typeOfClaim).toEqual([
      TypesOfClaim.PAY_RELATED_CLAIM,
      TypesOfClaim.DISCRIMINATION,
      TypesOfClaim.BREACH_OF_CONTRACT,
      TypesOfClaim.UNFAIR_DISMISSAL,
      TypesOfClaim.WHISTLE_BLOWING,
      TypesOfClaim.OTHER_TYPES,
    ]);
  });
});
