import { LoggerInstance } from 'winston';

import RespondentAddressController from '../../../main/controllers/RespondentAddressController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';
describe('Respondent Address Controller', () => {
  const t = {
    respondentAddress: {},
    common: {},
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the Respondent Address controller page', () => {
    const controller = new RespondentAddressController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    const userCase = {
      id: '12354',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      selectedRespondent: 1,
      respondents: [
        {
          respondentNumber: 1,
          respondentName: 'Globo Gym',
        },
      ],
    };
    request.session.userCase = userCase;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_ADDRESS, expect.anything());
  });

  it('should render the Work Address page on post', () => {
    const body = {};
    const controller = new RespondentAddressController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ body });

    request.session.userCase = userCaseWithRespondent;

    controller.post(request, response);

    expect(response.redirect).toBeCalledWith(PageUrls.WORK_ADDRESS);
  });
  it('should render the Acas Cert Num page on post when more than one respondent', () => {
    const body = {};
    const controller = new RespondentAddressController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ body });

    request.session.userCase = {
      id: '12354',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      selectedRespondent: 2,
      respondents: [
        {
          respondentNumber: 1,
          respondentName: 'Globo Gym',
        },
        {
          respondentNumber: 2,
          respondentName: 'Enron',
        },
      ],
    };

    controller.post(request, response);

    expect(response.redirect).toBeCalledWith(PageUrls.ACAS_CERT_NUM);
  });
});
