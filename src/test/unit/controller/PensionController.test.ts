import PensionController from '../../../main/controllers/PensionController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { FormError } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Pension controller', () => {
  const t = {
    pension: {},
    common: {},
  };

  it('should render the pension page', () => {
    const controller = new PensionController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('pension', expect.anything());
  });

  it('should not return an error when no radio buttons are selected', () => {
    const body = {
      pension: '',
    };
    const errors: FormError[] = [];
    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.BENEFITS);
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the pension form value to the userCase', () => {
    const body = { claimantPensionContribution: YesOrNo.NO };

    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase).toStrictEqual({ claimantPensionContribution: YesOrNo.NO });
  });
});
