import ReasonableAdjustmentsController from '../../../main/controllers/ReasonableAdjustmentsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import * as FormHelpers from '../../../main/controllers/helpers/FormHelpers';
import { CaseTypeId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Reasonable Adjustments Controller', () => {
  let controller: ReasonableAdjustmentsController;
  let getPageContentSpy: jest.SpyInstance;

  beforeEach(() => {
    controller = new ReasonableAdjustmentsController();
    getPageContentSpy = jest.spyOn(FormHelpers, 'getPageContent');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const t = {
    'reasonable-adjustments': {},
    common: {},
  };

  it('should render the Reasonable Adjustments page', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('reasonable-adjustments', expect.anything());
  });

  it('should redirect to your support when CUI your support is enabled for the case type', async () => {
    const featureMock = jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    try {
      const response = mockResponse();
      const request = mockRequest({ userCase: { caseTypeId: CaseTypeId.SCOTLAND }, t });

      await controller.get(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
    } finally {
      featureMock.mockRestore();
    }
  });

  it.each([
    { caseTypeId: CaseTypeId.ENGLAND_WALES, represented: YesOrNo.NO },
    { caseTypeId: CaseTypeId.ENGLAND_WALES, represented: YesOrNo.YES },
    { caseTypeId: CaseTypeId.SCOTLAND, represented: YesOrNo.NO },
    { caseTypeId: CaseTypeId.SCOTLAND, represented: YesOrNo.YES },
  ])('should render and save the legacy support form with CUI disabled for %j', async caseData => {
    const featureMock = jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([]));
    try {
      const request = mockRequest({
        body: {
          reasonableAdjustments: YesOrNo.YES,
          reasonableAdjustmentsDetail: 'Support with hearing documents',
        },
        userCase: {
          caseTypeId: caseData.caseTypeId,
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          claimantRepresentedQuestion: caseData.represented,
        },
      });
      const response = mockResponse();

      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith('reasonable-adjustments', expect.anything());
      expect(response.redirect).not.toHaveBeenCalled();

      await controller.post(request, response);

      expect(CaseHelper.handleUpdateDraftCase).toHaveBeenCalledWith(request, expect.anything());
      expect(response.redirect).toHaveBeenCalledWith(
        caseData.represented === YesOrNo.YES ? PageUrls.REPRESENTATIVE_DETAILS_CHECK : PageUrls.PERSONAL_DETAILS_CHECK
      );
      expect(request.session.userCase.reasonableAdjustments).toBe(YesOrNo.YES);
      expect(request.session.userCase.reasonableAdjustmentsDetail).toBe('Support with hearing documents');
      expect(request.session.yourSupportSaveError).toBeUndefined();
    } finally {
      featureMock.mockRestore();
    }
  });

  describe('get()', () => {
    it('should render the reasonable-adjustments template', async () => {
      const request = mockRequest({ t: { 'reasonable-adjustments': {}, common: {} } });
      const response = mockResponse();

      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith('reasonable-adjustments', expect.anything());
    });

    it('should use the standard translation key when claimant is not represented', async () => {
      const request = mockRequest({
        t: { 'reasonable-adjustments': {}, common: {} },
        userCase: { claimantRepresentedQuestion: YesOrNo.NO },
      });
      const response = mockResponse();

      await controller.get(request, response);

      expect(getPageContentSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.arrayContaining([TranslationKeys.REASONABLE_ADJUSTMENTS])
      );
      expect(getPageContentSpy).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.arrayContaining([TranslationKeys.REASONABLE_ADJUSTMENTS_NON_HMCTS])
      );
    });

    it('should use the non-HMCTS translation key when claimant is represented', async () => {
      const request = mockRequest({
        t: { 'reasonable-adjustments-non-hmcts': {}, common: {} },
        userCase: { claimantRepresentedQuestion: YesOrNo.YES },
      });
      const response = mockResponse();

      await controller.get(request, response);

      expect(getPageContentSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.arrayContaining([TranslationKeys.REASONABLE_ADJUSTMENTS_NON_HMCTS])
      );
      expect(getPageContentSpy).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.arrayContaining([TranslationKeys.REASONABLE_ADJUSTMENTS])
      );
    });

    it('should use the standard translation key when claimantRepresentedQuestion is not set', async () => {
      const request = mockRequest({ t: { 'reasonable-adjustments': {}, common: {} } });
      const response = mockResponse();

      await controller.get(request, response);

      expect(getPageContentSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.arrayContaining([TranslationKeys.REASONABLE_ADJUSTMENTS])
      );
    });
  });

  describe('post()', () => {
    it('should redirect to personal-details-check when nothing is selected as the form is optional', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.PERSONAL_DETAILS_CHECK);
    });

    it('should save reasonableAdjustments and reasonableAdjustmentsDetail to userCase when Yes is selected', async () => {
      const body = {
        reasonableAdjustments: 'Yes',
        reasonableAdjustmentsDetail: 'Reasonable adjustments detail test text',
      };
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase).toStrictEqual({
        reasonableAdjustments: 'Yes',
        reasonableAdjustmentsDetail: 'Reasonable adjustments detail test text',
      });
    });

    it('should redirect to personal-details-check when No is selected', async () => {
      const req = mockRequest({ body: { reasonableAdjustments: 'No' } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.PERSONAL_DETAILS_CHECK);
    });

    it('should redirect to REPRESENTATIVE_DETAILS_CHECK when claimantRepresentedQuestion is YES', async () => {
      const req = mockRequest({
        body: { reasonableAdjustments: 'No' },
        userCase: { claimantRepresentedQuestion: YesOrNo.YES },
      });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTATIVE_DETAILS_CHECK);
    });
  });
});
