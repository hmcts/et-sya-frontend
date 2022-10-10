import CheckYourAnswersController from '../../../main/controllers/CheckYourAnswersController';
import checkAnswersJsonRaw from '../../../main/resources/locales/en/translation/check-your-answers.json';
import et1DetailsJsonRaw from '../../../main/resources/locales/en/translation/et1-details.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
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
});
