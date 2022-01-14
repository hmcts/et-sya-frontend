import sinon from 'sinon';
import LipOrRepController from '../../../main/controllers/LipOrRepController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const lipOrRepController = new LipOrRepController();
const expectedLegacyURL = 'https://employmenttribunals.service.gov.uk/apply';

describe('LiP or Representative Controller', () => {
  const t = {
    'lip-or-representative': {},
  };

  it('should render the \'representing myself (LiP) or using a representative choice\' page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('lip-or-representative', request.t('lip-or-representative', { returnObjects: true }));

    lipOrRepController.get(request, response);
    responseMock.verify();
  });

  it('should render the Single or Multiple claims page when \'representing myself\' is selected', () => {
    const response = mockResponse();
    const body = { 'lip-or-representative': 'lip' };
    const request = mockRequest({ t, body });

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs('/single-or-multiple-claim');

    lipOrRepController.post(request, response);
    responseMock.verify();
  });

  it('should render the legacy ET1 service when the \'making a claim for someone else\' option is selected', () => {
    const response = mockResponse();
    const body = { 'lip-or-representative': 'representative' };
    const request = mockRequest({ t, body });

    const responseMock = sinon.mock(response);

    responseMock
      .expects('redirect')
      .once()
      .withArgs(expectedLegacyURL);

    lipOrRepController.post(request, response);
    responseMock.verify();
  });

  it('should render same page if nothing selected', () => {
    const response = mockResponse();
    const body = { 'lip-or-representative': '' };
    const request = mockRequest({ t, body });

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('lip-or-representative');

    lipOrRepController.post(request, response);
    responseMock.verify();
  });

});
