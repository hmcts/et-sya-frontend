import TribunalResponseCYAController from '../../../main/controllers/TribunalResponseCYAController';
import tribunalResponseRaw from '../../../main/resources/locales/en/translation/tribunal-response-cya.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tribunal Response CYA Controller', () => {
  const translationJsons = { ...tribunalResponseRaw };

  it('should render the Check your answers page', () => {
    const controller = new TribunalResponseCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.selectedRequestOrOrder = { id: '1' };
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('tribunal-response-cya', expect.anything());
  });

  it('should set isRespondingToRequestOrOrder to true when responding to a request within application', () => {
    const controller = new TribunalResponseCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.selectedGenericTseApplication = { id: '1' };
    controller.get(request, response);
    expect(request.session.userCase.isRespondingToRequestOrOrder).toBe(true);
  });
});
