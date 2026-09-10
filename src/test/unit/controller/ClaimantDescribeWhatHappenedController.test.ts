import ClaimantDescribeWhatHappenedController from '../../../main/controllers/ClaimantDescribeWhatHappenedController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantDescribeWhatHappenedController', () => {
  const t = {
    'claimant-describe-what-happened': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant describe what happened page (AC1)', () => {
      const controller = new ClaimantDescribeWhatHappenedController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_DESCRIBE_WHAT_HAPPENED, expect.anything());
    });

    it('should pre-populate form with existing claimSummaryText from session', () => {
      const controller = new ClaimantDescribeWhatHappenedController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { claimSummaryText: 'The claimant was unfairly dismissed.' } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_DESCRIBE_WHAT_HAPPENED, expect.anything());
      expect(request.session.userCase.claimSummaryText).toEqual('The claimant was unfairly dismissed.');
    });

    it('should pass postAddress to render context', () => {
      const controller = new ClaimantDescribeWhatHappenedController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.postAddress).toEqual(PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED);
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_TELL_US_WHAT_YOU_WANT when text is provided (AC3)', async () => {
      const body = { claimSummaryText: 'The claimant was unfairly dismissed.' };
      const controller = new ClaimantDescribeWhatHappenedController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_TELL_US_WHAT_YOU_WANT);
    });

    it('should error when no text and no file and no existing file (AC2)', async () => {
      const body = { claimSummaryText: '' };
      const controller = new ClaimantDescribeWhatHappenedController();
      const req = mockRequest({ body });
      req.session.userCase.claimSummaryFile = undefined;
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED);
      expect(req.session.errors).toEqual([{ propertyName: 'claimSummaryText', errorType: 'required' }]);
    });

    it('should redirect to CLAIMANT_TELL_US_WHAT_YOU_WANT when an existing file is in session (AC3)', async () => {
      const body = { claimSummaryText: '' };
      const controller = new ClaimantDescribeWhatHappenedController();
      const req = mockRequest({ body });
      req.session.userCase.claimSummaryFile = {
        document_url: 'http://doc',
        document_filename: 'claim.pdf',
        document_binary_url: 'http://doc/binary',
      };
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_TELL_US_WHAT_YOU_WANT);
    });

    it('should error when text exceeds 2500 characters (AC2)', async () => {
      const body = { claimSummaryText: 'a'.repeat(2501) };
      const controller = new ClaimantDescribeWhatHappenedController();
      const req = mockRequest({ body });
      req.session.userCase.claimSummaryFile = undefined;
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors.some((e: { propertyName: string }) => e.propertyName === 'claimSummaryText')).toBe(
        true
      );
    });
  });
});
