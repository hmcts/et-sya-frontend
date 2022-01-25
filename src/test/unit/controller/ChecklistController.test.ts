import sinon from 'sinon';
import { Response } from 'express';
import ChecklistController from '../../../main/controllers/ChecklistController';
import { mockRequest } from '../mocks/mockRequest';

const checklistController = new ChecklistController();

describe('Checklist Controller', () => {
  const t = {
    checklist: {},
  };

  it('should render the checklist page', () => {
    const response = { render: () => '' } as unknown as Response;
    const request = mockRequest(t);
    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('checklist', request.t('checklist', { returnObjects: true }));
    checklistController.get(request, response);
    responseMock.verify();
  });
});