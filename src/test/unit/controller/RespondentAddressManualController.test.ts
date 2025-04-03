import RespondentAddressManualController from '../../../main/controllers/RespondentAddressManualController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Respondent Address Manual Controller', () => {
  const t = {
    respondentAddress: {},
    common: {},
  };

  it('should render the Respondent Address Manual controller page', () => {
    const controller = new RespondentAddressManualController();

    const response = mockResponse();
    const request = mockRequest({ t });

    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_ADDRESS_MANUAL, expect.anything());
  });

  it('should render the Work Address page on post', async () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressManualController();

    const response = mockResponse();
    const request = mockRequest({ body });

    request.session.userCase = userCaseWithRespondent;

    await controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/respondent/1/work-address');
  });

  it('should render the Acas Cert Num page on post when more than one respondent', async () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressManualController();

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

    await controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/respondent/1/acas-cert-num');
  });

  it('should render the Acas Cert Num page when claimant did not work for the respondent', async () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressManualController();

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
      ],
      pastEmployer: YesOrNo.NO,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };

    await controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/respondent/1/acas-cert-num');
  });

  it('should redirect to your claim has been saved page when save as draft selected and nothing is entered', async () => {
    const body = { saveForLater: true };
    const controller = new RespondentAddressManualController();

    const req = mockRequest({ body });
    const res = mockResponse();

    req.session.userCase = {
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

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should add respondent address to the session userCase', async () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressManualController();
    const req = mockRequest({ body });
    const res = mockResponse();

    req.session.userCase = {
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

    await controller.post(req, res);
    expect(req.session.userCase.respondents[0].respondentAddress1).toStrictEqual('10 test street');
    expect(req.session.userCase.respondents[0].respondentAddressTown).toStrictEqual('test');
    expect(req.session.userCase.respondents[0].respondentAddressCountry).toStrictEqual('Test Country');
    expect(req.session.userCase.respondents[0].respondentAddressPostcode).toStrictEqual('AB1 2CD');

    expect(req.session.userCase.respondents[0].respondentNumber).toStrictEqual(1);
  });
});
