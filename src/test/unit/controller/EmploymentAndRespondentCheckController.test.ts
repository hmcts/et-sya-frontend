import EmploymentAndRespondentCheckController from '../../../main/controllers/EmploymentAndRespondentCheckController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { returnValidUrl } from '../../../main/controllers/helpers/RouterHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Test task List check controller', () => {
  const t = {
    employmentAndRespondentCheck: {},
    common: {},
  };

  it('should render the task list check page', () => {
    const controller = new EmploymentAndRespondentCheckController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
  });

  it('should render the claim steps page', async () => {
    const body = { employmentAndRespondentCheck: YesOrNo.YES };
    const controller = new EmploymentAndRespondentCheckController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });

  it('should render same page if nothing selected', async () => {
    const errors = [{ propertyName: 'employmentAndRespondentCheck', errorType: 'required' }];
    const body = { employmentAndRespondentCheck: '' };
    const controller = new EmploymentAndRespondentCheckController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(returnValidUrl(req.path, Object.values(PageUrls)));
    //expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
