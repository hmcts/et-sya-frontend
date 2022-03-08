import NewJobStartDateController from '../../../main/controllers/new_job_start_date/NewJobStartDateController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('New Job Start Date Controller', () => {
  const t = {
    'new-job-start-date': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render the New Job Start Date page', () => {
    const controller = new NewJobStartDateController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NEW_JOB, expect.anything());
  });
});
