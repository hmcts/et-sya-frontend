import StillWorkingController from '../../../main/controllers/StillWorkingController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Are you still working controller', () => {
  const t = {
    isStillWorking: {},
    common: {},
  };

  it('should render are you still working page', () => {
    const controller = new StillWorkingController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STILL_WORKING, expect.anything());
  });

  it('should render the employment details page', async () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new StillWorkingController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.JOB_TITLE);
  });

  it('should render the job title page when the page submitted', async () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new StillWorkingController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.JOB_TITLE);
  });

  it('should add isStillWorking to the session userCase', async () => {
    const body = { isStillWorking: StillWorking.WORKING };

    const controller = new StillWorkingController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.JOB_TITLE);
    expect(req.session.userCase).toStrictEqual({
      isStillWorking: StillWorking.WORKING,
      endDate: undefined,
      noticeEnds: undefined,
    });
  });

  it('should remove endDate and noticeEnds when isStillWorking = WORKING', async () => {
    const body = { isStillWorking: StillWorking.WORKING };

    const controller = new StillWorkingController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    req.session.userCase.endDate = { year: '2024', month: '01', day: '01' };
    req.session.userCase.noticeEnds = { year: '2024', month: '02', day: '02' };

    await controller.post(req, res);

    expect(req.session.userCase.endDate).toStrictEqual(undefined);
    expect(req.session.userCase.noticeEnds).toStrictEqual(undefined);
  });

  it('should remove noticeEnds when isStillWorking = NO_LONGER_WORKING', async () => {
    const body = { isStillWorking: StillWorking.NO_LONGER_WORKING };

    const controller = new StillWorkingController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    req.session.userCase.endDate = { year: '2024', month: '01', day: '01' };
    req.session.userCase.noticeEnds = { year: '2024', month: '02', day: '02' };

    await controller.post(req, res);

    expect(req.session.userCase.endDate).toStrictEqual({ year: '2024', month: '01', day: '01' });
    expect(req.session.userCase.noticeEnds).toStrictEqual(undefined);
  });

  it('should remove endDate when isStillWorking = NOTICE', async () => {
    const body = { isStillWorking: StillWorking.NOTICE };

    const controller = new StillWorkingController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    req.session.userCase.endDate = { year: '2024', month: '01', day: '01' };
    req.session.userCase.noticeEnds = { year: '2024', month: '02', day: '02' };

    await controller.post(req, res);

    expect(req.session.userCase.endDate).toStrictEqual(undefined);
    expect(req.session.userCase.noticeEnds).toStrictEqual({ year: '2024', month: '02', day: '02' });
  });

  it('should redirect START_DATE when returnUrl is cya and startDate is undefined', async () => {
    const req = mockRequest({ body: { isStillWorking: StillWorking.NOTICE } });
    req.session.returnUrl = PageUrls.CHECK_ANSWERS;
    req.session.userCase.startDate = undefined;
    const res = mockResponse();

    await new StillWorkingController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.START_DATE);
  });

  it('should redirect NOTICE_END when returnUrl is cya and isStillWorking is NOTICE', async () => {
    const req = mockRequest({ body: { isStillWorking: StillWorking.NOTICE } });
    req.session.returnUrl = PageUrls.CHECK_ANSWERS;
    req.session.userCase.startDate = { year: '2024', month: '01', day: '01' };
    const res = mockResponse();

    await new StillWorkingController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOTICE_END);
  });

  it('should redirect END_DATE when returnUrl is cya and isStillWorking is NO_LONGER_WORKING', async () => {
    const req = mockRequest({ body: { isStillWorking: StillWorking.NO_LONGER_WORKING } });
    req.session.returnUrl = PageUrls.CHECK_ANSWERS;
    req.session.userCase.startDate = { year: '2024', month: '01', day: '01' };
    const res = mockResponse();

    await new StillWorkingController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.END_DATE);
  });

  it('should redirect CYA when returnUrl is cya and isStillWorking is WORKING', async () => {
    const req = mockRequest({ body: { isStillWorking: StillWorking.WORKING } });
    req.session.returnUrl = PageUrls.CHECK_ANSWERS;
    req.session.userCase.startDate = { year: '2024', month: '01', day: '01' };
    const res = mockResponse();

    await new StillWorkingController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS);
  });

  it('should go to the next screen when errors are present', async () => {
    const body = {
      isStillWorking: '',
    };

    const controller = new StillWorkingController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.JOB_TITLE);
  });
});
