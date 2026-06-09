import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantCompensationController from '../../../../main/controllers/non-hmcts/ClaimantCompensationController';
import { CaseWithId } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../../../../main/definitions/definition';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantCompensationController', () => {
  const t = {
    'non-hmcts/claimant-compensation': {},
    common: {},
  };

  it('should render the claimant compensation page on GET', () => {
    const controller = new ClaimantCompensationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_COMPENSATION, expect.anything());
  });

  it('should redirect to CLAIMANT_LINKED_CASES on POST with details (AC2)', async () => {
    const body = { compensationDetails: 'Lost wages for 6 months', totalCompensationAmount: '12000' };
    const controller = new ClaimantCompensationController();
    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_LINKED_CASES);
  });

  it('should redirect to CLAIMANT_LINKED_CASES on POST with no input (page is optional, AC2)', async () => {
    const body = {};
    const controller = new ClaimantCompensationController();
    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_LINKED_CASES);
  });

  it('should redirect to CLAIMANT_TRIBUNAL_RECOMMENDATION when tribunal is also selected', async () => {
    const body = { compensationDetails: 'Lost wages' };
    const userCase: Partial<CaseWithId> = {
      tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY, TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION],
    };
    const controller = new ClaimantCompensationController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_TRIBUNAL_RECOMMENDATION);
  });

  it('should redirect to WHISTLEBLOWING_CLAIMS when whistleblowing is in typeOfClaim and tribunal not selected', async () => {
    const body = { compensationDetails: 'Lost wages' };
    const userCase: Partial<CaseWithId> = {
      tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY],
      typeOfClaim: [TypesOfClaim.WHISTLE_BLOWING],
    };
    const controller = new ClaimantCompensationController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.WHISTLEBLOWING_CLAIMS);
  });
});
