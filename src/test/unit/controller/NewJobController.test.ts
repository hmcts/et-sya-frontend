import NewJobController from '../../../main/controllers/NewJobController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('New Job Controller', () => {
  const t = {
    'new-job': {},
    common: {},
  };

  it('should render the New Job Choice page', () => {
    const controller = new NewJobController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NEW_JOB, expect.anything());
  });

  it('should clear fields', () => {
    const controller = new NewJobController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.newJob = YesOrNo.NO;
    request.query = {
      redirect: 'clearSelection',
    };
    controller.get(request, response);
    expect(request.session.userCase.newJob).toStrictEqual(undefined);
  });

  it('should render the respondent name page when neither radio button is selected', async () => {
    const body = { newJob: '' };
    const controller = new NewJobController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.FIRST_RESPONDENT_NAME);
  });

  it('should render the respondent name page when no radio button is selected', async () => {
    const body = { newJob: YesOrNo.NO };
    const controller = new NewJobController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.FIRST_RESPONDENT_NAME);
  });

  it('should render the new job start date page when yes radio button is selected', async () => {
    const body = { newJob: YesOrNo.YES };
    const controller = new NewJobController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NEW_JOB_START_DATE);
  });

  it('should reset new job values if No selected', async () => {
    const body = { newJob: YesOrNo.NO };
    const controller = new NewJobController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.FIRST_RESPONDENT_NAME);
    expect(req.session.userCase).toStrictEqual({
      newJob: YesOrNo.NO,
      newJobStartDate: undefined,
      newJobPay: undefined,
      newJobPayInterval: undefined,
      state: 'AWAITING_SUBMISSION_TO_HMCTS',
    });
  });
});
