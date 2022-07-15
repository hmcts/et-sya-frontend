import WhistleblowingClaimsController from '../../../main/controllers/WhistleblowingClaimsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Whistleblowing Claims Controller', () => {
  const t = {
    'whistleblowing-claims': {},
    common: {},
  };

  it('should render the whistleblowing claims page', () => {
    const controller = new WhistleblowingClaimsController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.WHISTLEBLOWING_CLAIMS, expect.anything());
  });
});
