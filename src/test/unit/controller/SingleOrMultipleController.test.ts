import SingleOrMultipleController from '../../../main/controllers/SingleOrMultipleController';
import { CaseType } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

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

  it("should render the next page when 'single' is selected", () => {
    const body = { caseType: CaseType.SINGLE };
    const controller = new SingleOrMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_JURISDICTION_SELECTION);
  });

  it("should render the legacy ET1 service when the 'multiple' claim option is selected", () => {
    const body = { caseType: CaseType.MULTIPLE };
    const controller = new SingleOrMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('https://et-pet-et1.aat.platform.hmcts.net/en/apply/application-number');
  });

  it('should render same page if nothing selected', () => {
    const errors = [{ propertyName: 'caseType', errorType: 'required' }];
    const body = { caseType: '' };
    const controller = new SingleOrMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
