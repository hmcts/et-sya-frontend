import DescribeWhatHappenedController from '../../../main/controllers/DescribeWhatHappenedController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { mockFile } from '../mocks/mockFile';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Describe-What-Happened Controller', () => {
  const t = {
    'describe-what-happened': {},
    common: {},
  };
  const helperMock = jest.spyOn(helper, 'handleUploadDocument');

  beforeAll(() => {
    const uploadResponse: DocumentUploadResponse = {
      originalDocumentName: 'test.txt',
      uri: 'test.com',
      _links: {
        binary: {
          href: 'test.com',
        },
      },
    } as DocumentUploadResponse;

    (helperMock as jest.Mock).mockReturnValue({
      data: uploadResponse,
    });
  });

  it('should render describe what happened page', () => {
    const controller = new DescribeWhatHappenedController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.DESCRIBE_WHAT_HAPPENED, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require either summary text or summary file', async () => {
      const req = mockRequest({ body: { claimSummaryText: '' } });
      await new DescribeWhatHappenedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'claimSummaryText', errorType: 'required' }]);
    });

    it('should only allow valid file formats', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileFormat';
      const req = mockRequest({ body: {}, file: newFile });
      await new DescribeWhatHappenedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'claimSummaryFileName', errorType: 'invalidFileFormat' }]);
    });

    it('should assign userCase from summary text', async () => {
      const req = mockRequest({ body: { claimSummaryText: 'test' } });
      const res = mockResponse();
      jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());

      await new DescribeWhatHappenedController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.TELL_US_WHAT_YOU_WANT + languages.ENGLISH_URL_PARAMETER);
      expect(req.session.userCase).toMatchObject({
        claimSummaryText: 'test',
      });
    });
  });

  describe('Handling bot submissions', () => {
    it('should return 200 and do nothing for bot form submissions', async () => {
      jest.resetAllMocks();
      const req = mockRequest({ body: { claimSummaryText: 'test', url: 'hello im a bot' } });
      const res = mockResponse();
      jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());

      await new DescribeWhatHappenedController().post(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(helper.handleUpdateDraftCase).not.toHaveBeenCalled();
      expect(res.statusCode).toStrictEqual(200);
      expect(res.end).toHaveBeenCalledWith('Thank you for your submission. You will be contacted in due course.');
    });
  });
});
