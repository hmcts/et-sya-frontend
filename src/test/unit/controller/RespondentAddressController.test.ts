import axios from 'axios';

import RespondentAddressController from '../../../main/controllers/RespondentAddressController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { CaseApi } from '../../../main/services/CaseService';
import { mockLogger } from '../mocks/mockLogger';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Respondent Address Controller', () => {
  const t = {
    respondentAddress: {},
    common: {},
  };

  it('should render the Respondent Address controller page', () => {
    const controller = new RespondentAddressController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_ADDRESS, expect.anything());
  });

  it('should render the Work Address page on post', () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ body });

    request.session.userCase = userCaseWithRespondent;

    controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/respondent/1/work-address');
  });

  it('should render the Acas Cert Num page on post when more than one respondent', () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ body });

    request.session.userCase = {
      id: '12354',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
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
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };

    controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/respondent/1/acas-cert-num');
  });
  it('should redirect to your claim has been saved page when save as draft selected and nothing is entered', () => {
    const body = { saveForLater: true };
    const controller = new RespondentAddressController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should add respondent address to the session userCase', () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(req.session.userCase.respondents[0].respondentAddress1).toStrictEqual('10 test street');
    expect(req.session.userCase.respondents[0].respondentAddressTown).toStrictEqual('test');
    expect(req.session.userCase.respondents[0].respondentAddressCountry).toStrictEqual('Test Country');
    expect(req.session.userCase.respondents[0].respondentAddressPostcode).toStrictEqual('AB1 2CD');

    expect(req.session.userCase.respondents[0].respondentNumber).toStrictEqual(1);
  });

  it('should run logger in catch block', async () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toHaveBeenCalled());
  });
});
