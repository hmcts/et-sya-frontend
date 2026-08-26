import CheckYourAnswersController from '../../../main/controllers/CheckYourAnswersController';
import { CaseType, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState, TypesOfClaim } from '../../../main/definitions/definition';
import checkAnswersJsonRaw from '../../../main/resources/locales/en/translation/check-your-answers.json';
import et1DetailsJsonRaw from '../../../main/resources/locales/en/translation/et1-details.json';
import { mockRequestEmpty, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Check Your answers Controller', () => {
  const translationJsons = { ...checkAnswersJsonRaw, ...et1DetailsJsonRaw };

  const validUserCase = {
    state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
    typeOfClaim: [TypesOfClaim.DISCRIMINATION],
    address1: '10 Test Street',
    addressTown: 'Test Town',
    addressCountry: 'United Kingdom',
    addressPostcode: 'AB1 2CD',
    caseType: CaseType.SINGLE,
    respondents: [
      {
        respondentAddress1: '20 Respondent Road',
        respondentAddressTown: 'Respondent Town',
        respondentAddressCountry: 'United Kingdom',
        respondentAddressPostcode: 'CD3 4EF',
        acasCert: YesOrNo.YES,
        acasCertNum: 'R123456-78-90',
      },
    ],
    claimSummaryText: 'This is what happened.',
  };

  it('should render the Check your answers page', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase: validUserCase }, translationJsons);

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('check-your-answers', expect.anything());
  });

  it('should render the Check your answers page when no past employer', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({ userCase: validUserCase }, translationJsons);
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
    const request = mockRequestWithTranslation({ userCase: validUserCase }, translationJsons);
    request.session.userCase.typeOfClaim = [TypesOfClaim.DISCRIMINATION, TypesOfClaim.PAY_RELATED_CLAIM];
    request.session.userCase.claimTypeDiscrimination = null;
    request.session.userCase.claimTypePay = null;

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('check-your-answers', expect.anything());
  });

  it('should redirect to steps to making your claim when no type of claim is selected', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequestWithTranslation(
      { userCase: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS, typeOfClaim: [] } },
      translationJsons
    );

    controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
    expect(response.render).not.toHaveBeenCalled();
  });
});
