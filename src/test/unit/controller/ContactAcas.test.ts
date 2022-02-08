import sinon from 'sinon';

import ContactAcasController from '../../../main/controllers/ContactAcasController';
import { ACAS_EC_URL } from '../../../main/definitions/constants';
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
    const responseMock = sinon.mock(response);
    responseMock
      .expects('render')
      .once()
      .withArgs('contact-acas', {
        ...request.t('contact-acas', { returnObjects: true }),
        acasUrl: ACAS_EC_URL,
      });
    checklistController.get(request, response);
    responseMock.verify();
  });
});
