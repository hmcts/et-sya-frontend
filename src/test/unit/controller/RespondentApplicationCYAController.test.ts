import RespondentApplicationCYAController from '../../../main/controllers/RespondentApplicationCYAController';
import jsonRaw from '../../../main/resources/locales/en/translation/respondent-application-cya.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';


describe('Tribunal Response CYA Controller', () => {
  const translationJsons = { ...jsonRaw };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should render the Check your answers page', async () => {
    const controller = new RespondentApplicationCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.selectedGenericTseApplication = { id: '1' };
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('respondent-application-cya', expect.anything());
  });

  it('should set isRespondingToRequestOrOrder to false this response is not part of an application', async () => {
    const controller = new RespondentApplicationCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.selectedGenericTseApplication = { id: '1' };
    await controller.get(request, response);
    expect(request.session.userCase.isRespondingToRequestOrOrder).toBe(false);
  });
});
