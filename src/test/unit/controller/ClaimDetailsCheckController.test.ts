import ClaimDetailsCheckController from '../../../main/controllers/ClaimDetailsCheckController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ClaimTypePay, TypesOfClaim } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Test claim details check controller', () => {
  const t = {
    claimDetailsCheck: {},
    common: {},
  };

  it('should render the task list check page', () => {
    const controller = new ClaimDetailsCheckController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_DETAILS_CHECK, expect.anything());
  });

  it('should redirect to claim steps page for regular flow when Yes and all mandatory fields are answered', async () => {
    const body = { claimDetailsCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = {
      typeOfClaim: [TypesOfClaim.PAY_RELATED_CLAIM],
      claimTypePay: [ClaimTypePay.ARREARS],
      claimSummaryText: 'test',
    };
    const controller = new ClaimDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });

  it('should redirect to non-HMCTS claim steps page when claimant is represented and Yes and all mandatory fields are answered', async () => {
    const body = { claimDetailsCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = {
      claimantRepresentedQuestion: YesOrNo.YES,
      typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL],
      claimSummaryText: 'test',
    };
    const controller = new ClaimDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS);
  });

  it('should redirect to claim steps page when No is selected (AC3)', async () => {
    const body = { claimDetailsCheck: YesOrNo.NO };
    const controller = new ClaimDetailsCheckController();
    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });

  it('should render the claim details check page with errors when isValid is false (AC4)', async () => {
    const body = { claimDetailsCheck: YesOrNo.YES };
    const controller = new ClaimDetailsCheckController();
    const req = mockRequest({ body });
    const res = mockResponse();

    jest
      .spyOn(require('../../../main/components/form/claim-details-validator'), 'validateClaimCheckDetails')
      .mockReturnValue(false);

    await controller.post(req, res);

    expect(req.session.errors).toEqual([{ propertyName: 'claimDetailsCheck', errorType: 'invalid' }]);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_DETAILS_CHECK, expect.anything());
  });

  it('should show error when discrimination selected but claimTypeDiscrimination not answered (AC4)', async () => {
    const body = { claimDetailsCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = {
      typeOfClaim: [TypesOfClaim.DISCRIMINATION],
      claimSummaryText: 'test',
    };
    const controller = new ClaimDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(req.session.errors).toEqual([{ propertyName: 'claimDetailsCheck', errorType: 'invalid' }]);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_DETAILS_CHECK, expect.anything());
  });

  it('should show error when pay-related selected but claimTypePay not answered (AC4)', async () => {
    const body = { claimDetailsCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = {
      typeOfClaim: [TypesOfClaim.PAY_RELATED_CLAIM],
      claimSummaryText: 'test',
    };
    const controller = new ClaimDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(req.session.errors).toEqual([{ propertyName: 'claimDetailsCheck', errorType: 'invalid' }]);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_DETAILS_CHECK, expect.anything());
  });
});
