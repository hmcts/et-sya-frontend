import PayController from '../../../main/controllers/PayController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PayInterval } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

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

  it('should clear fields', () => {
    const controller = new PayController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.payInterval = PayInterval.ANNUAL;
    request.session.userCase.payBeforeTax = 40000;
    request.session.userCase.payAfterTax = 30000;

    request.query = {
      redirect: 'clearSelection',
    };
    controller.get(request, response);
    expect(request.session.userCase.payBeforeTax).toStrictEqual(undefined);
    expect(request.session.userCase.payAfterTax).toStrictEqual(undefined);
    expect(request.session.userCase.payInterval).toStrictEqual(undefined);
  });

  it('should render the pension page when the page submitted', async () => {
    const body = {
      payBeforeTax: '123',
      payAfterTax: '122',
      payInterval: PayInterval.WEEKLY,
    };
    const controller = new PayController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.PENSION);
  });

  it('should add payBeforeTax, payAfterTax and payInterval to the session userCase', async () => {
    const body = { payBeforeTax: '123', payAfterTax: '124', payInterval: PayInterval.WEEKLY };
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
    const controller = new PayController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

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
    const expectedErrors = [{ propertyName: 'payBeforeTax', errorType: 'invalidCurrency' }];
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
    const body = { payAfterTax: '0.1', payInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ propertyName: 'payAfterTax', errorType: 'minLengthRequired' }];
    const response = mockResponse();
    const request = mockRequest({ body });
    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });
});
