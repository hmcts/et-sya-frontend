import PensionController from '../../../main/controllers/PensionController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
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

  it('should render the benefits page when no radio buttons are selected', () => {
    const body = {
      claimantPensionContribution: '',
    };
    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
  });

  it('should render the benefits page when yes radio button is selected and amount is left blank', () => {
    const body = {
      claimantPensionContribution: YesOrNo.YES,
      claimantPensionWeeklyContribution: '',
    };
    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
  });

  it('should render same page if an invalid value is entered', () => {
    const errors = [{ propertyName: 'claimantPensionWeeklyContribution', errorType: 'notANumber' }];
    const body = { claimantPensionContribution: YesOrNo.YES, claimantPensionWeeklyContribution: 'a' };
    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the pension form value to the userCase', () => {
    const body = { claimantPensionContribution: YesOrNo.YES, claimantPensionWeeklyContribution: '14' };

    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase).toStrictEqual(body);
  });

  it('should reset contribution if No selected', () => {
    const body = { claimantPensionContribution: YesOrNo.NO };

    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase).toStrictEqual({
      claimantPensionContribution: YesOrNo.NO,
      claimantPensionWeeklyContribution: undefined,
    });
  });
});
