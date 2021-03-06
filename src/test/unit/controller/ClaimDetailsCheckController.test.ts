import ClaimDetailsCheckController from '../../../main/controllers/ClaimDetailsCheckController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Test task List check controller', () => {
  const t = {
    claimDetailsCheck: {},
    common: {},
  };

  it('should render the task list check page', () => {
    const controller = new ClaimDetailsCheckController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
  });

  it('should render the claim steps page', () => {
    const body = { claimDetailsCheck: YesOrNo.YES };
    const controller = new ClaimDetailsCheckController();
    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(PageUrls.CLAIM_STEPS);
  });
});
