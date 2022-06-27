import { AxiosResponse } from 'axios';
import { LoggerInstance } from 'winston';

import ReasonableAdjustmentsController from '../../../main/controllers/ReasonableAdjustmentsController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import * as caseApi from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Reasonable Adjustments Controller', () => {
  const t = {
    'reasonable-adjustments': {},
    common: {},
  };
  const getCaseApiMock = jest.spyOn(caseApi, 'getCaseApi');

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the Reasonable Adjustments page', () => {
    const controller = new ReasonableAdjustmentsController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('reasonable-adjustments', expect.anything());
  });

  describe('post() reasonable adjustments', () => {
    it('should redirect to the next page when nothing is selected as the form is optional', () => {
      const body = {};

      const controller = new ReasonableAdjustmentsController(mockLogger);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.PERSONAL_DETAILS_CHECK);
    });
  });

  it('should invoke logger in then() block', async () => {
    const body = { employeeBenefits: YesOrNo.NO };
    const controller = new ReasonableAdjustmentsController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();
    const fetchResponse = Promise.resolve({} as AxiosResponse<CaseApiDataResponse>);

    (getCaseApiMock as jest.Mock).mockReturnValue({
      updateDraftCase: jest.fn(() => {
        return fetchResponse;
      }),
    });

    await controller.post(request, response);

    expect(mockLogger.info).toBeCalled();
  });
});
