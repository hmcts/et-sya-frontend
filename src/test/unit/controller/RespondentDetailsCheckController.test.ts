import RespondentDetailsCheckController from '../../../main/controllers/RespondentDetailsCheckController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

describe('Respondent Details Check Controller', () => {
  const t = {
    respondentDetails: {},
    common: {},
  };

  it('should render the Respondent Details Check controller page', () => {
    const controller = new RespondentDetailsCheckController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_DETAILS_CHECK, expect.anything());
  });

  it('should render the Respondent Name controller page and increment the respondent number on post', () => {
    const body = {};
    const controller = new RespondentDetailsCheckController();

    const response = mockResponse();
    const request = mockRequest({ body });

    request.session.userCase = userCaseWithRespondent;

    controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/respondent/2/respondent-name');
    expect(request.session.userCase.respondents).toStrictEqual([{ respondentName: 'Globo Gym', respondentNumber: 1 }]);
  });
});
