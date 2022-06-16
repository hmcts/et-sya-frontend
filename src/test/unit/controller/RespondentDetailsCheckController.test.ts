import RespondentDetailsCheckController from '../../../main/controllers/RespondentDetailsCheckController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
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

  it('should render the Respondent Name controller page and add new respondent on post', () => {
    const body = {};
    const controller = new RespondentDetailsCheckController();

    const response = mockResponse();
    const request = mockRequest({ body });

    request.session.userCase = userCaseWithRespondent;

    controller.post(request, response);

    expect(response.redirect).toBeCalledWith(PageUrls.RESPONDENT_NAME);
    expect(request.session.userCase.selectedRespondent).toStrictEqual(2);
    expect(request.session.userCase.respondents).toStrictEqual([
      { respondentName: 'Globo Gym', respondentNumber: 1 },
      { respondentNumber: 2 },
    ]);
  });
});
