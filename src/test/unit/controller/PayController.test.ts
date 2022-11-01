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

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.PENSION);
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

  it('should have error when pay is entered and interval is not entered', () => {
    const controller = new PayController();
    const body = { payBeforeTax: '6700', payInterval: '' };
    const expectedErrors = [{ propertyName: 'payInterval', errorType: 'payBeforeTax' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should have error when pay is not a valid number', () => {
    const controller = new PayController();
    const body = { payBeforeTax: 'ten', payInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ propertyName: 'payBeforeTax', errorType: 'notANumber' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should have errors when no pay is entered and interval is entered', () => {
    const controller = new PayController();
    const body = { payBeforeTax: '', payAfterTax: '', payInterval: PayInterval.WEEKLY };
    const expectedErrors = [
      { propertyName: 'payBeforeTax', errorType: 'required' },
      { propertyName: 'payAfterTax', errorType: 'required' },
    ];
    const response = mockResponse();
    const request = mockRequest({ body });
    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });

  it('should have error when pay is less than two characters', () => {
    const controller = new PayController();
    const body = { payAfterTax: '1', payInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ propertyName: 'payAfterTax', errorType: 'minLengthRequired' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });
});
