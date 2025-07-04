import NewJobPayController from '../../../main/controllers/NewJobPayController';
import { PayInterval } from '../../../main/definitions/case';
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

  it('should have error when pay is entered and interval is not entered', async () => {
    const controller = new NewJobPayController();
    const body = { newJobPay: '6700', newJobPayInterval: '' };
    const expectedErrors = [{ propertyName: 'newJobPayInterval', errorType: 'required' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    await controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should have error when pay is not a valid number', async () => {
    const controller = new NewJobPayController();
    const body = { newJobPay: 'ten', newJobPayInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ propertyName: 'newJobPay', errorType: 'invalid' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    await controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should have error when no pay is entered and interval is entered', async () => {
    const controller = new NewJobPayController();
    const body = { newJobPay: '', newJobPayInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ propertyName: 'newJobPay', errorType: 'required' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    await controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should have error when pay is less than two characters', async () => {
    const controller = new NewJobPayController();
    const body = { newJobPay: '1', newJobPayInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ propertyName: 'newJobPay', errorType: 'minLengthRequired' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    await controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });
});
