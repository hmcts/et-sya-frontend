import ClaimantRespondentDetailsCheckController from '../../../main/controllers/ClaimantRespondentDetailsCheckController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseWithId, Respondent, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

const completeRespondent: Respondent = {
  respondentName: 'Acme Ltd',
  respondentAddress1: '1 Test Street',
  respondentAddressTown: 'London',
  respondentAddressCountry: 'England',
  acasCert: YesOrNo.YES,
  acasCertNum: 'A123456/21/12345',
};

describe('ClaimantRespondentDetailsCheckController', () => {
  const t = {
    'claimant-respondent-details-check': {},
    common: {},
  };

  it('should render the claimant respondent details check page on GET', () => {
    const controller = new ClaimantRespondentDetailsCheckController();
    const response = mockResponse();
    const request = mockRequest({ t, userCase: { respondents: [completeRespondent] } });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, expect.anything());
  });

  it('should redirect to claim steps non-HMCTS when Yes and all mandatory fields are answered (AC1)', async () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = {
      claimantRepresentedQuestion: YesOrNo.YES,
      respondents: [completeRespondent],
    };
    const controller = new ClaimantRespondentDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS);
  });

  it('should redirect to claim steps non-HMCTS when No is selected (AC3)', async () => {
    const body = { employmentAndRespondentCheck: YesOrNo.NO };
    const userCase: Partial<CaseWithId> = {
      claimantRepresentedQuestion: YesOrNo.YES,
      respondents: [completeRespondent],
    };
    const controller = new ClaimantRespondentDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS);
  });

  it('should show invalid error when Yes selected but respondent name missing (AC4)', async () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = {
      claimantRepresentedQuestion: YesOrNo.YES,
      respondents: [{ ...completeRespondent, respondentName: undefined }],
    };
    const controller = new ClaimantRespondentDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(req.session.errors).toEqual([{ propertyName: 'employmentAndRespondentCheck', errorType: 'invalid' }]);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, expect.anything());
  });

  it('should show invalid error when Yes selected but respondent address missing (AC4)', async () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = {
      claimantRepresentedQuestion: YesOrNo.YES,
      respondents: [{ ...completeRespondent, respondentAddress1: undefined }],
    };
    const controller = new ClaimantRespondentDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(req.session.errors).toEqual([{ propertyName: 'employmentAndRespondentCheck', errorType: 'invalid' }]);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, expect.anything());
  });

  it('should show invalid error when Yes selected but ACAS cert info missing (AC4)', async () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = {
      claimantRepresentedQuestion: YesOrNo.YES,
      respondents: [{ ...completeRespondent, acasCert: undefined }],
    };
    const controller = new ClaimantRespondentDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(req.session.errors).toEqual([{ propertyName: 'employmentAndRespondentCheck', errorType: 'invalid' }]);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, expect.anything());
  });
});
