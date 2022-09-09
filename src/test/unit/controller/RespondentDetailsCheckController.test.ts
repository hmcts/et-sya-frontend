import RespondentDetailsCheckController from '../../../main/controllers/RespondentDetailsCheckController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWith6Respondents, userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

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
  it('should render the respondent-details-check page and increment the respondent number on post', () => {
    const body = {};
    const controller = new RespondentDetailsCheckController();

    const response = mockResponse();
    const request = mockRequest({ body });
    request.url = PageUrls.RESPONDENT_DETAILS_CHECK;
    request.session.userCase = userCaseWith6Respondents;

    controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_DETAILS_CHECK);
    expect(request.session.userCase.respondents).toHaveLength(6);
  });
});
