import axios from 'axios';

import NewJobPayController from '../../../main/controllers/NewJobPayController';
import { PayInterval } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockLogger } from '../mocks/mockLogger';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('New Job Pay Controller', () => {
  const t = {
    'new-job-pay': {},
    common: {},
  };

  it('should render the New Job Pay page', () => {
    const controller = new NewJobPayController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NEW_JOB_PAY, expect.anything());
  });

  it('should have error when pay is entered and interval is not entered', () => {
    const controller = new NewJobPayController(mockLogger);
    const body = { newJobPay: '6700', newJobPayInterval: '' };
    const expectedErrors = [{ propertyName: 'newJobPayInterval', errorType: 'required' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should have error when pay is not a valid number', () => {
    const controller = new NewJobPayController(mockLogger);
    const body = { newJobPay: 'ten', newJobPayInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ propertyName: 'newJobPay', errorType: 'notANumber' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should have error when no pay is entered and interval is entered', () => {
    const controller = new NewJobPayController(mockLogger);
    const body = { newJobPay: '', newJobPayInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ propertyName: 'newJobPay', errorType: 'required' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should have error when pay is less than two characters', () => {
    const controller = new NewJobPayController(mockLogger);
    const body = { newJobPay: '1', newJobPayInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ propertyName: 'newJobPay', errorType: 'minLengthRequired' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should run logger in catch block', async () => {
    const body = { newJobPay: '123', newJobPayInterval: PayInterval.WEEKLY };
    const controller = new NewJobPayController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toBeCalled());
  });
});
