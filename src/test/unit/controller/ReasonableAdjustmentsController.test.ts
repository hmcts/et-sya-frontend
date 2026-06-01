import ReasonableAdjustmentsController from '../../../main/controllers/ReasonableAdjustmentsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import * as FormHelpers from '../../../main/controllers/helpers/FormHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
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

  describe('get()', () => {
    it('should render the reasonable-adjustments template', () => {
      const request = mockRequest({ t: { 'reasonable-adjustments': {}, common: {} } });
      const response = mockResponse();

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith('reasonable-adjustments', expect.anything());
    });

    it('should use the standard translation key when claimant is not represented', () => {
      const request = mockRequest({
        t: { 'reasonable-adjustments': {}, common: {} },
        userCase: { claimantRepresentedQuestion: YesOrNo.NO },
      });
      const response = mockResponse();

      controller.get(request, response);

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

    it('should use the non-HMCTS translation key when claimant is represented', () => {
      const request = mockRequest({
        t: { 'reasonable-adjustments-non-hmcts': {}, common: {} },
        userCase: { claimantRepresentedQuestion: YesOrNo.YES },
      });
      const response = mockResponse();

      controller.get(request, response);

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

    it('should use the standard translation key when claimantRepresentedQuestion is not set', () => {
      const request = mockRequest({ t: { 'reasonable-adjustments': {}, common: {} } });
      const response = mockResponse();

      controller.get(request, response);

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
