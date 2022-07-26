import RespondentNameController from '../../../main/controllers/RespondentNameController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

describe('Respondent Name Controller', () => {
  const t = {
    respondentName: {},
    common: {},
  };

  it('should render the Respondent Name controller page when respondents empty', () => {
    const controller = new RespondentNameController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_NAME, expect.anything());
  });

  it('should render the Respondent Name controller page when respondent exists', () => {
    const controller = new RespondentNameController();

    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_NAME, expect.anything());
  });

  it('should create new respondent and add the respondent name to the session', () => {
    const body = { respondentName: 'Globo Gym' };

    const controller = new RespondentNameController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/respondent/1/respondent-address');
    expect(req.session.userCase.respondents[0]).toStrictEqual({
      respondentNumber: 1,
      respondentName: 'Globo Gym',
    });
  });

  it('should update selected respondent with new respondent name', () => {
    const body = { respondentName: 'Globe Gym' };

    const controller = new RespondentNameController();

    const req = mockRequest({ body });
    const res = mockResponse();

    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/respondent/1/respondent-address');
    expect(req.session.userCase.respondents[0]).toStrictEqual({
      respondentNumber: 1,
      respondentName: 'Globe Gym',
    });
  });
});
