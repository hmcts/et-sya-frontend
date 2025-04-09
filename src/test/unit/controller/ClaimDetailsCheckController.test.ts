import ClaimDetailsCheckController from '../../../main/controllers/ClaimDetailsCheckController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ClaimTypePay } from '../../../main/definitions/definition';
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

  it('should render the claim steps page', async () => {
    const body = { claimDetailsCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = { claimTypePay: [ClaimTypePay.NOTICE_PAY], claimSummaryText: 'test' };
    const controller = new ClaimDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });
});
