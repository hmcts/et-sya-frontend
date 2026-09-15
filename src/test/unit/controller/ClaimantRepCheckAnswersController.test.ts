import ClaimantRepCheckAnswersController from '../../../main/controllers/ClaimantRepCheckAnswersController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import claimantRepCYAJson from '../../../main/resources/locales/en/translation/claimant-rep-check-your-answers.json';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import et1DetailsJson from '../../../main/resources/locales/en/translation/et1-details.json';
import { mockRequestEmpty, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('ClaimantRepCheckAnswersController', () => {
  const translations = { ...commonJson, ...et1DetailsJson, ...claimantRepCYAJson };

  it('should render the claimant rep check your answers page', () => {
    const controller = new ClaimantRepCheckAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translations);

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_REP_CHECK_ANSWERS, expect.anything());
  });

  it('should redirect to claimant applications when session has no userCase', () => {
    const controller = new ClaimantRepCheckAnswersController();
    const response = mockResponse();
    const request = mockRequestEmpty({});
    request.session.userCase = null;

    controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });

  it('should render with discrimination claim type', () => {
    const controller = new ClaimantRepCheckAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation(
      { userCase: { typeOfClaim: [TypesOfClaim.DISCRIMINATION] } },
      translations
    );

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_REP_CHECK_ANSWERS, expect.anything());
  });

  it('should render with pay related claim type', () => {
    const controller = new ClaimantRepCheckAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation(
      { userCase: { typeOfClaim: [TypesOfClaim.PAY_RELATED_CLAIM] } },
      translations
    );

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_REP_CHECK_ANSWERS, expect.anything());
  });

  it('should pass errors from session to the render context', () => {
    const controller = new ClaimantRepCheckAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translations);
    request.session.errors = [{ propertyName: 'hiddenErrorField', errorType: 'api' }];

    controller.get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.errors).toEqual([{ propertyName: 'hiddenErrorField', errorType: 'api' }]);
  });

  it('should default respondents to empty array when undefined', () => {
    const controller = new ClaimantRepCheckAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase: { respondents: undefined } }, translations);

    controller.get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.respondents).toEqual([]);
  });
});
