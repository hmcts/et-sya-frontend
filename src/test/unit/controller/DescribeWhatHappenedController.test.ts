import SummariseYourClaimController from '../../../main/controllers/DescribeWhatHappenedController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

// eslint-disable-next-line jest/valid-title
describe('Describe What Happened Controller', () => {
  const t = {
    'describe-what-happened': {},
    common: {},
  };

  it('should render describe what happened page', () => {
    const controller = new SummariseYourClaimController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.DESCRIBE_WHAT_HAPPENED, expect.anything());
  });

  describe('post()', () => {
    it('should assign userCase from formData for Describe What Happened Outcome', () => {
      const body = { claimSummaryText: 'test', claimSummaryFile: 'testFile.txt' };

      const controller = new SummariseYourClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.TELL_US_WHAT_YOU_WANT);
      expect(req.session.userCase).toStrictEqual({
        claimSummaryText: 'test',
        claimSummaryFile: 'testFile.txt',
      });
    });
  });
});
