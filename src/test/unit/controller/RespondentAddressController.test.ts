import RespondentAddressController from '../../../main/controllers/RespondentAddressController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

describe('Respondent Address Controller', () => {
  const t = {
    respondentAddress: {},
    common: {},
  };

  it('should render the Respondent Address controller page', () => {
    const controller = new RespondentAddressController();

    const response = mockResponse();
    const request = mockRequest({ t });

    const userCase = userCaseWithRespondent;
    request.session.userCase = userCase;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_ADDRESS, expect.anything());
  });

  it('should render the Work Address page on post', () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
    };
    const controller = new RespondentAddressController();

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
    };
    const controller = new RespondentAddressController();

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
    };

    controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/respondent/1/acas-cert-num');
  });
});
