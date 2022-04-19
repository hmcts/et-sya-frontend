import SingleOrMultipleController from '../../../main/controllers/SingleOrMultipleController';
import { YesOrNo } from '../../../main/definitions/case';
import { LegacyUrls, PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Single or Multiple Claim Controller', () => {
  const t = {
    isASingleClaim: {},
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
    const body = { isASingleClaim: YesOrNo.YES };
    const controller = new SingleOrMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.ACAS_MULTIPLE_CLAIM);
  });

  it("should render the legacy ET1 service when the 'multiple' claim option is selected", () => {
    const body = { isASingleClaim: YesOrNo.NO };
    const controller = new SingleOrMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(LegacyUrls.ET1);
  });

  it('should render same page if nothing selected', () => {
    const errors = [{ propertyName: 'isASingleClaim', errorType: 'required' }];
    const body = { isASingleClaim: '' };
    const controller = new SingleOrMultipleController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
