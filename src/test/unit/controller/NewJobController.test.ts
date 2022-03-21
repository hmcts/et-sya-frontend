import NewJobController from '../../../main/controllers/NewJobController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('New Job Controller', () => {
  const t = {
    'new-job': {},
    common: {},
  };

  it('should render the New Job Choice page', () => {
    const controller = new NewJobController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NEW_JOB, expect.anything());
  });
});
