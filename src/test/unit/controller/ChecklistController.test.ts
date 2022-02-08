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
    const request = mockRequest({ t });
    checklistController.get(request, response);
    expect(response.render).toHaveBeenCalledWith('checklist', request.t('checklist', { returnObjects: true }));
  });
});
