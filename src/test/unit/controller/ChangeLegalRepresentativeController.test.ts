import ChangeLegalRepresentativeController from '../../../main/controllers/ChangeLegalRepresentativeController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const changeLegalRepresentativeController = new ChangeLegalRepresentativeController();

describe('ChangeLegalRepresentative Controller', () => {
  const t = {
    home: {},
  };

  it('should render the onboarding (home) page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.id = '1234567890123456';
    changeLegalRepresentativeController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CHANGE_LEGAL_REPRESENTATIVE, expect.anything());
  });
});
