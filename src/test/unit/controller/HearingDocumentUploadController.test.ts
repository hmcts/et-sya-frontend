import HearingDocumentUploadController from '../../../main/controllers/HearingDocumentUploadController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { TranslationKeys } from '../../../main/definitions/constants';
import pageTranslations from '../../../main/resources/locales/en/translation/hearing-document-upload.json';
import { mockFile, mockPdf } from '../mocks/mockFile';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Document Upload controller', () => {
  const t = {
    'hearing-document-upload': {},
    common: {},
  };
  const helperMock = jest.spyOn(helper, 'handleUploadDocument');
  const translationJsons = { ...pageTranslations };

  beforeAll(() => {
    const uploadResponse: DocumentUploadResponse = {
      originalDocumentName: 'test.pdf',
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
    const controller = new HearingDocumentUploadController();
    const res = mockResponse();
    const req = mockRequestWithTranslation({ t }, translationJsons);
    req.params.hearingId = '12345-abc-12345';

    controller.get(req, res);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.HEARING_DOCUMENT_UPLOAD, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require a pdf file to be uploaded', async () => {
      const req = mockRequest({ body: {} });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      await new HearingDocumentUploadController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'required' }]);
    });

    it('should only allow pdf file types to be uploaded', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileFormat';
      const req = mockRequest({ body: {}, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      await new HearingDocumentUploadController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'invalidFileFormat' }]);
    });

    it('should only allow valid file sizes', async () => {
      const newFile = mockPdf;
      newFile.originalname = 'file.invalidFileSize';
      const req = mockRequest({ body: {}, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      req.fileTooLarge = true;
      await new HearingDocumentUploadController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'invalidFileSize' }]);
    });

    it('should only allow valid file names', async () => {
      const newFile = mockPdf;
      newFile.originalname = '$%?invalid.pdf';
      const req = mockRequest({ body: {}, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      await new HearingDocumentUploadController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'invalidFileName' }]);
    });
  });
});
