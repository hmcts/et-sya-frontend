import RespondentApplicationCYAController from '../../../main/controllers/RespondentApplicationCYAController';
import jsonRaw from '../../../main/resources/locales/en/translation/respondent-application-cya.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal Response CYA Controller', () => {
  const translationJsons = { ...jsonRaw };

  it('should render the Check your answers page', () => {
    const controller = new RespondentApplicationCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.selectedGenericTseApplication = { id: '1' };
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('respondent-application-cya', expect.anything());
  });

  it('should set isRespondingToRequestOrOrder to false this response is not part of an application', () => {
    const controller = new RespondentApplicationCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.selectedGenericTseApplication = { id: '1' };
    controller.get(request, response);
    expect(request.session.userCase.isRespondingToRequestOrOrder).toBe(false);
  });
});
