import sinon from 'sinon';
import ChecklistController from '../../../main/controllers/ChecklistController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const checklistController = new ChecklistController();

describe('Checklist Controller', () => {
  const t = {
    checklist: {},
  };

  it('should render the checklist page', () => {
    const response = mockResponse();
    const request = mockRequest(t);
    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('checklist', request.t('checklist', { returnObjects: true }));
    checklistController.get(request, response);
    responseMock.verify();
  });
});