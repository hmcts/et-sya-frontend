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
      endDate: undefined,
      isStillWorking: StillWorking.WORKING,
    });
  });

  it('should redirect to the same screen when errors are present', async () => {
    const errors = [{ propertyName: 'isStillWorking', errorType: 'required' }];
    const body = {
      isStillWorking: '',
    };

    const controller = new StillWorkingController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
