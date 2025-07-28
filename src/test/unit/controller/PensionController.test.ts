import PensionController from '../../../main/controllers/PensionController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo, YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

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

  it('should clear fields', () => {
    const controller = new PensionController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.claimantPensionContribution = YesOrNoOrNotSure.NOT_SURE;
    request.query = {
      redirect: 'clearSelection',
    };
    controller.get(request, response);
    expect(request.session.userCase.claimantPensionContribution).toStrictEqual(undefined);
  });

  it('should render the benefits page when no radio buttons are selected', async () => {
    const body = {
      claimantPensionContribution: '',
    };
    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
  });

  it('should render the benefits page when yes radio button is selected and amount is left blank', async () => {
    const body = {
      claimantPensionContribution: YesOrNo.YES,
      claimantPensionWeeklyContribution: '',
    };
    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
  });

  it('should render same page if an invalid value is entered', async () => {
    const errors = [{ propertyName: 'claimantPensionWeeklyContribution', errorType: 'invalidCurrency' }];
    const body = { claimantPensionContribution: YesOrNo.YES, claimantPensionWeeklyContribution: 'a' };
    const controller = new PensionController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the pension form value to the userCase', async () => {
    const body = { claimantPensionContribution: YesOrNo.YES, claimantPensionWeeklyContribution: '14' };

    const controller = new PensionController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase).toStrictEqual({
      ...body,
    });
  });

  it('should reset contribution if No selected', async () => {
    const body = { claimantPensionContribution: YesOrNo.NO };

    const controller = new PensionController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    req.session.userCase = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      claimantPensionWeeklyContribution: 12344,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    };

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase.claimantPensionContribution).toStrictEqual(YesOrNo.NO);
    expect(req.session.userCase.claimantPensionWeeklyContribution).toStrictEqual(undefined);
  });
});
