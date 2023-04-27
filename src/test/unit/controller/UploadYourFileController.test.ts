import UploadYourFileController from '../../../main/controllers/UploadYourFileController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { TranslationKeys } from '../../../main/definitions/constants';
import pageTranslations from '../../../main/resources/locales/en/translation/upload-your-file.json';
import { mockFile, mockPdf } from '../mocks/mockFile';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Document Upload controller', () => {
  const t = {
    'upload-your-file': {},
    common: {},
  };
  const helperMock = jest.spyOn(helper, 'handleUploadDocument');
  const translationJsons = { ...pageTranslations };

  beforeAll(() => {
    jest.spyOn(helper, 'submitClaimantTse').mockImplementation(() => Promise.resolve());
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

  it('should render hearing document file upload page', () => {
    const controller = new UploadYourFileController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({ t }, translationJsons);
    request.params.appId = '1';

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.UPLOAD_YOUR_FILE, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require a pdf file to be uploaded', async () => {
      const req = mockRequest({ body: { responseText: '' } });
      await new UploadYourFileController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocumentError', errorType: 'required' }]);
    });

    it('should only allow pdf file types to be uploaded', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileFormat';
      const req = mockRequest({ body: {}, file: newFile });
      await new UploadYourFileController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocumentError', errorType: 'invalidFileFormat' }]);
    });

    it('should only allow valid file sizes', async () => {
      const newFile = mockPdf;
      newFile.originalname = 'file.invalidFileSize';
      const req = mockRequest({ body: {}, file: newFile });
      req.fileTooLarge = true;
      await new UploadYourFileController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocumentError', errorType: 'invalidFileSize' }]);
    });

    it('should only allow valid file names', async () => {
      const newFile = mockPdf;
      newFile.originalname = '$%?invalid.pdf';
      const req = mockRequest({ body: {}, file: newFile });
      await new UploadYourFileController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocumentError', errorType: 'invalidFileName' }]);
    });

    it('should assign values when clicking upload file for appropriate values', async () => {
      const req = mockRequest({
        body: { upload: true, hearingDocumentFile: mockPdf },
      });
      const res = mockResponse();

      await new UploadYourFileController().post(req, res);

      expect(req.session.userCase).toContain({
        hearingDocument: {
          document_filename: 'test.pdf',
        },
      });
    });
  });
});
