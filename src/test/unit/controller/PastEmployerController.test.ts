import PastEmployerController from '../../../main/controllers/PastEmployerController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { StillWorking, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Update Past Employer Controller', () => {
  const t = {
    'past-employer': {},
    common: {},
  };

  it('should render the Update Preference page', () => {
    const controller = new PastEmployerController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('past-employer', expect.anything());
  });

  it('should go to the next screen when errors are present', async () => {
    const body = { pastEmployer: '' };

    const controller = new PastEmployerController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.FIRST_RESPONDENT_NAME);
  });

  it('should render are you still working page when the page submitted', async () => {
    const body = { pastEmployer: YesOrNo.YES };
    const controller = new PastEmployerController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.STILL_WORKING);
  });

  it('should add pastEmployer to the session userCase', async () => {
    const body = { pastEmployer: YesOrNo.YES };

    const controller = new PastEmployerController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      pastEmployer: YesOrNo.YES,
    });
  });

  it('should redirect STILL_WORKING when returnUrl is cya and isStillWorking is undefined', async () => {
    const req = mockRequestEmpty({ body: { pastEmployer: YesOrNo.YES } });
    req.session.returnUrl = PageUrls.CHECK_ANSWERS;
    req.session.userCase.isStillWorking = undefined;
    const res = mockResponse();

    await new PastEmployerController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.STILL_WORKING);
  });

  it('should redirect CHECK_ANSWERS when returnUrl is cya and isStillWorking is WORKING', async () => {
    const req = mockRequestEmpty({ body: { pastEmployer: YesOrNo.YES } });
    req.session.returnUrl = PageUrls.CHECK_ANSWERS;
    req.session.userCase.isStillWorking = StillWorking.WORKING;
    const res = mockResponse();

    await new PastEmployerController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS);
  });

  it('should redirect CHECK_ANSWERS when returnUrl is cya and pastEmployer is No', async () => {
    const req = mockRequestEmpty({ body: { pastEmployer: YesOrNo.NO } });
    req.session.returnUrl = PageUrls.CHECK_ANSWERS;
    req.session.userCase.isStillWorking = undefined;
    const res = mockResponse();

    await new PastEmployerController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS);
  });
});
