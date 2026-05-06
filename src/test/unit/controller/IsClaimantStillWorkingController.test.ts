import IsClaimantStillWorkingController from '../../../main/controllers/IsClaimantStillWorkingController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('IsClaimantStillWorkingController', () => {
  const t = {
    'is-claimant-still-working': {},
    common: {},
  };

  it('should render the is claimant still working page', () => {
    const controller = new IsClaimantStillWorkingController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.IS_CLAIMANT_STILL_WORKING, expect.anything());
  });

  it('should redirect to CLAIMANT_EMPLOYMENT_DETAILS when claimant is still working', async () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new IsClaimantStillWorkingController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DETAILS);
  });

  it('should redirect to NOTICE_END when claimant is working a notice period', async () => {
    const body = { isStillWorking: StillWorking.NOTICE };
    const controller = new IsClaimantStillWorkingController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_END);
  });

  it('should redirect to END_DATE when claimant is no longer working', async () => {
    const body = { isStillWorking: StillWorking.NO_LONGER_WORKING };
    const controller = new IsClaimantStillWorkingController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.END_DATE);
  });

  it('should redirect to CLAIMANT_EMPLOYMENT_DETAILS when no value is submitted', async () => {
    const body = { isStillWorking: '' };
    const controller = new IsClaimantStillWorkingController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DETAILS);
  });

  it('should save isStillWorking to session userCase', async () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new IsClaimantStillWorkingController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      isStillWorking: StillWorking.WORKING,
      endDate: undefined,
      noticeEnds: undefined,
    });
  });

  it('should clear endDate and noticeEnds when claimant is still working', async () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new IsClaimantStillWorkingController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    req.session.userCase.endDate = { year: '2024', month: '01', day: '01' };
    req.session.userCase.noticeEnds = { year: '2024', month: '02', day: '02' };

    await controller.post(req, res);

    expect(req.session.userCase.endDate).toBeUndefined();
    expect(req.session.userCase.noticeEnds).toBeUndefined();
  });

  it('should clear noticeEnds but keep endDate when claimant is no longer working', async () => {
    const body = { isStillWorking: StillWorking.NO_LONGER_WORKING };
    const controller = new IsClaimantStillWorkingController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    req.session.userCase.endDate = { year: '2024', month: '01', day: '01' };
    req.session.userCase.noticeEnds = { year: '2024', month: '02', day: '02' };

    await controller.post(req, res);

    expect(req.session.userCase.endDate).toStrictEqual({ year: '2024', month: '01', day: '01' });
    expect(req.session.userCase.noticeEnds).toBeUndefined();
  });

  it('should clear endDate but keep noticeEnds when claimant is working a notice period', async () => {
    const body = { isStillWorking: StillWorking.NOTICE };
    const controller = new IsClaimantStillWorkingController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    req.session.userCase.endDate = { year: '2024', month: '01', day: '01' };
    req.session.userCase.noticeEnds = { year: '2024', month: '02', day: '02' };

    await controller.post(req, res);

    expect(req.session.userCase.endDate).toBeUndefined();
    expect(req.session.userCase.noticeEnds).toStrictEqual({ year: '2024', month: '02', day: '02' });
  });
});
