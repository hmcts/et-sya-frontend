import DescribeWhatHappenedController from '../../../main/controllers/DescribeWhatHappenedController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Describe-What-Happened Controller', () => {
  const t = {
    'describe-what-happened': {},
    common: {},
  };

  it('should render describe what happened page', () => {
    const controller = new DescribeWhatHappenedController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.DESCRIBE_WHAT_HAPPENED, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require either summary text or summary file', () => {
      const req = mockRequest({ body: { claimSummaryText: '', claimSummaryFile: '' } });
      new DescribeWhatHappenedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'claimSummaryText', errorType: 'required' }]);
    });

    it('should not allow both summary text and summary file', () => {
      const req = mockRequest({ body: { claimSummaryText: 'text', claimSummaryFile: 'file.txt' } });
      new DescribeWhatHappenedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'claimSummaryText', errorType: 'textAndFile' }]);
    });

    it('should only allow valid file formats', () => {
      const req = mockRequest({ body: { claimSummaryFile: 'file.invalidFileFormat' } });
      new DescribeWhatHappenedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'claimSummaryFile', errorType: 'invalidFileFormat' }]);
    });

    it('should assign userCase from summary text', () => {
      const req = mockRequest({ body: { claimSummaryText: 'test' } });
      const res = mockResponse();

      new DescribeWhatHappenedController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.TELL_US_WHAT_YOU_WANT);
      expect(req.session.userCase).toMatchObject({
        claimSummaryText: 'test',
      });
    });

    it('should assign userCase from summary file', () => {
      const req = mockRequest({ body: { claimSummaryFile: 'testFile.txt' } });
      const res = mockResponse();

      new DescribeWhatHappenedController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.TELL_US_WHAT_YOU_WANT);
      expect(req.session.userCase).toMatchObject({
        claimSummaryFile: 'testFile.txt',
      });
    });
  });
});
