import PayController from '../../../main/controllers/PayController';
import { PayInterval } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Pay Controller', () => {
  const t = {
    pay: {},
    common: {},
  };

  it('should render pay page', () => {
    const payController = new PayController();
    const response = mockResponse();
    const request = mockRequest({ t });

    payController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.PAY, expect.anything());
  });

  it('should render the pension page when the page submitted', () => {
    const body = {
      payBeforeTax: '123',
      payAfterTax: '122',
      payInterval: PayInterval.WEEKLY,
    };
    const controller = new PayController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.PENSION);
  });

  it('should add payBeforeTax, payAfterTax and payInterval to the session userCase', () => {
    const body = { payBeforeTax: '123', payAfterTax: '124', payInterval: PayInterval.WEEKLY };

    const controller = new PayController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      payBeforeTax: '123',
      payAfterTax: '124',
      payInterval: PayInterval.WEEKLY,
    });
  });
});
