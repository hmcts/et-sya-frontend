import NewJobStartDateController from '../../../main/controllers/NewJobStartDateController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('New Job Start Date Controller', () => {
  const t = {
    'new-job-start-date': {},
    common: {},
  };

  it('should render the New Job Start Date page', () => {
    const controller = new NewJobStartDateController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NEW_JOB_START_DATE, expect.anything());
  });
});
