import NewJobPayController from '../../../main/controllers/NewJobPayController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('New Job Pay Controller', () => {
  const t = {
    'new-job-pay': {},
    common: {},
  };

  it('should render the New Job Pay page', () => {
    const controller = new NewJobPayController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NEW_JOB_PAY, expect.anything());
  });
});
