import CheckYourAnswersController from '../../../main/controllers/CheckYourAnswersController';
import { CaseWithId } from '../../../main/definitions/case';
import { TellUsWhatYouWant } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Check Your answers Controller', () => {
  const t = {
    'check-your-answers': {},
    common: {},
  };

  it('should render the Check your answers page', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('check-your-answers', expect.anything());
  });

  it('should render the Check your answers page with Compensation outcome', () => {
    const userCase: Partial<CaseWithId> = {
      tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY],
      compensationOutcome: 'money',
      compensationAmount: 1,
    };
    const controller = new CheckYourAnswersController();

    const req = mockRequest({ userCase });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      'check-your-answers',
      expect.objectContaining({
        whatYouWantCompensation: 'money: 1',
      })
    );
  });

  it('should render the Check your answers page with tribunal recommendation', () => {
    const userCase: Partial<CaseWithId> = {
      tellUsWhatYouWant: [TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION],
      tribunalRecommendationRequest: 'request',
    };
    const controller = new CheckYourAnswersController();

    const req = mockRequest({ userCase });
    const res = mockResponse();
    controller.get(req, res);
    expect(res.render).toHaveBeenCalledWith(
      'check-your-answers',
      expect.objectContaining({
        whatYouWantTribunals: 'request',
      })
    );
  });
});
