import SingleOrMultipleController from '../../../main/controllers/SingleOrMultipleController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseType } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Single or Multiple Claim Controller', () => {
  const t = {
    caseType: {},
    common: {},
  };

  it('should render single or multiple claim page', () => {
    const controller = new SingleOrMultipleController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('single-or-multiple-claim', expect.anything());
  });

  it("should redirect to claim steps when 'single' is selected", async () => {
    const body = { caseType: CaseType.SINGLE };
    const controller = new SingleOrMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });

  it("should redirect to claim steps when 'multiple' is selected", async () => {
    const body = { caseType: CaseType.MULTIPLE };
    const controller = new SingleOrMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });

  it('should render same page if nothing selected', async () => {
    const errors = [{ propertyName: 'caseType', errorType: 'required' }];
    const body = { caseType: '' };
    const controller = new SingleOrMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
