import PensionController from '../../../main/controllers/PensionController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
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

    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve({}));

    const controller = new PensionController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase).toStrictEqual(body);
  });

  it('should reset contribution if No selected', () => {
    const body = { claimantPensionContribution: YesOrNo.NO };

    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve({}));

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

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase.claimantPensionContribution).toStrictEqual(YesOrNo.NO);
    expect(req.session.userCase.claimantPensionWeeklyContribution).toStrictEqual(undefined);
  });
});
