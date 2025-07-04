import AppointLegalRepController from '../../../main/controllers/AppointLegalRepController';
import { CaseWithId } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('AppointLegalRepController', () => {
  let controller: AppointLegalRepController;

  beforeEach(() => {
    controller = new AppointLegalRepController();
    jest.clearAllMocks();
  });

  it('should render the Appoint Legal Representative page with correct data', async () => {
    const userCase: Partial<CaseWithId> = mockUserCase;
    const t = {
      common: {},
    };

    const response = mockResponse();
    const request = mockRequest({ t, userCase });
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.APPOINT_LEGAL_REPRESENTATIVE, expect.anything());
  });
});
