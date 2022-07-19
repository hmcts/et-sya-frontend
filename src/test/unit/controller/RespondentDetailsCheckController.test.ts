import RespondentDetailsCheckController from '../../../main/controllers/RespondentDetailsCheckController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

const maxRespondentArray = [
  {
    respondentNumber: 1,
    respondentName: 'Globo Gym',
  },
  {
    respondentNumber: 2,
    respondentName: 'Globo Gym',
  },
  {
    respondentNumber: 3,
    respondentName: 'Globo Gym',
  },
  {
    respondentNumber: 4,
    respondentName: 'Globo Gym',
  },
  {
    respondentNumber: 5,
    respondentName: 'Globo Gym',
  },
  {
    respondentNumber: 6,
    respondentName: 'Globo Gym',
  },
];

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

    expect(response.redirect).toBeCalledWith('/respondent/2/respondent-name');
    expect(request.session.userCase.respondents).toStrictEqual([
      { respondentName: 'Globo Gym', respondentNumber: 1 },
      { respondentNumber: 2 },
    ]);
  });

  it('should  fail to add more than 6 respondents', () => {
    const body = {};
    const controller = new RespondentDetailsCheckController();

    const response = mockResponse();
    const request = mockRequest({ body });

    request.session.userCase = {
      id: '12354',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      respondents: maxRespondentArray,
    };

    controller.post(request, response);

    expect(request.session.userCase.respondents).toStrictEqual(maxRespondentArray);
  });
});
