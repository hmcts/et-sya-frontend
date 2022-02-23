import ContactAcasController from '../../../main/controllers/ContactAcasController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const checklistController = new ContactAcasController();

describe('Contact Acas Controller', () => {
  const t = {
    'contact-acas': {},
  };

  it('should render the contact acas page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    checklistController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_ACAS, expect.anything());
  });
});
