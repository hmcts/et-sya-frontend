import CheckYourAnswersController from '../../../main/controllers/CheckYourAnswersController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Check Your answers Controller', () => {
  const t = {
    'check-your-answers': {},
    common: {},
  };

  it('should render the Job Title page', () => {
    const controller = new CheckYourAnswersController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('check-your-answers', expect.anything());
  });
});
