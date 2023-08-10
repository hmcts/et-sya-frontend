import RespondentRemoveController from '../../../main/controllers/RespondentRemoveController';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respondent Remove Controller', () => {
  const t = {
    respondentName: {},
    common: {},
  };
  const controller = new RespondentRemoveController();
  const response = mockResponse();
  const request = mockRequest({ t });
  request.session.userCase.respondents = [];
  request.session.userCase.respondents.push({
    respondentNumber: 1,
    respondentName: 'R1',
  });
  request.session.userCase.respondents.push({
    respondentNumber: 2,
    respondentName: 'R2',
  });
  request.session.userCase.respondents.push({
    respondentNumber: 3,
    respondentName: 'R3',
  });
  request.params = {
    respondentNumber: '2',
  };

  it('should remove respondent', async () => {
    await controller.get(request, response);
    expect(request.session.userCase.respondents).toHaveLength(2);
    expect(request.session.userCase.respondents[0].respondentName).toStrictEqual('R1');
    expect(request.session.userCase.respondents[1].respondentName).toStrictEqual('R3');
  });

  it('should redirect to RESPONDENT_DETAILS_CHECK', async () => {
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_DETAILS_CHECK);
  });

  it('should redirect to CHECK_ANSWERS', async () => {
    request.query = {
      redirect: 'answers',
    };
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS);
  });
});
