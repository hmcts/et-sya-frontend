import ClaimDetailsCheckController from '../../../main/controllers/ClaimDetailsCheckController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
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
    const userCase: Partial<CaseWithId> = { typeOfClaim: [TypesOfClaim.PAY_RELATED_CLAIM], claimSummaryText: 'test' };
    const controller = new ClaimDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });

  it('should render the claim details check page with errors when isValid is false', async () => {
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
});
