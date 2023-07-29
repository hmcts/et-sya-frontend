import RespondentAddInCheckAnswerController from '../../../main/controllers/RespondentAddInCheckAnswerController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respondent Add In Check Answer Controller', () => {
  const t = {
    respondentName: {},
    common: {},
  };

  it('should set session respondentRedirectCheckAnswer as true', () => {
    const controller = new RespondentAddInCheckAnswerController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(request.session.respondentRedirectCheckAnswer).toStrictEqual(true);
    expect(response.redirect).toHaveBeenCalledWith('/respondent/1/respondent-name');
  });
});
