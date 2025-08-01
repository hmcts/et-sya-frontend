import CheckYourAnswersController from '../../../main/controllers/CheckYourAnswersController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import checkAnswersJsonRaw from '../../../main/resources/locales/en/translation/check-your-answers.json';
import et1DetailsJsonRaw from '../../../main/resources/locales/en/translation/et1-details.json';
import { mockRequestEmpty, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Check Your answers Controller', () => {
  const translationJsons = { ...checkAnswersJsonRaw, ...et1DetailsJsonRaw };

  it('should render the Check your answers page', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('check-your-answers', expect.anything());
  });

  it('should render the Check your answers page when no past employer', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.pastEmployer = YesOrNo.NO;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('check-your-answers', expect.anything());
  });

  it('should redirect claimant applications page when there is no session', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequestEmpty({});
    request.session = null;

    controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });

  it('should redirect claimant applications page when there is no user case', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequestEmpty({});
    request.session.userCase = null;

    controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });

  it('should render the Check your answers page when there is a type of claim but no discrimination or pay type', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.typeOfClaim = [TypesOfClaim.DISCRIMINATION, TypesOfClaim.PAY_RELATED_CLAIM];
    request.session.userCase.claimTypeDiscrimination = null;
    request.session.userCase.claimTypePay = null;

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('check-your-answers', expect.anything());
  });
});
