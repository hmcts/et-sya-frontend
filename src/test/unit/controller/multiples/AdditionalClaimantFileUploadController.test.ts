import * as helper from '../../../../main/controllers/helpers/CaseHelpers';
import { AdditionalClaimantSpreadsheetService } from '../../../../main/controllers/helpers/multiples/AdditionalClaimantFileUploadService';
import AdditionalClaimantFileUploadController from '../../../../main/controllers/multiples/AdditionalClaimantFileUploadController';
import { DocumentUploadResponse } from '../../../../main/definitions/api/documentApiResponse';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import * as launchDarkly from '../../../../main/modules/featureFlag/launchDarkly';
import { mockFile } from '../../mocks/mockFile';
import { mockRequest, mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
jest.spyOn(launchDarkly, 'getFlagValue').mockResolvedValue(50);

const uploadResponse: DocumentUploadResponse = {
  originalDocumentName: 'claimants.xlsx',
  uri: 'http://dm-store/documents/abc-123',
  _links: {
    binary: {
      href: 'http://dm-store/documents/abc-123/binary',
    },
  },
} as DocumentUploadResponse;

const mockDocument = {
  document_url: uploadResponse.uri,
  document_filename: uploadResponse.originalDocumentName,
  document_binary_url: uploadResponse._links.binary.href,
};

const mockClaimants = [
  {
    firstName: 'Jane',
    lastName: 'Smith',
    address: { AddressLine1: '1 High Street', PostTown: 'London', Country: 'England' },
  },
];

describe('AdditionalClaimantFileUploadController', () => {
  const t = {
    'additional-claimant-file-upload': {},
    common: {},
  };

  let controller: AdditionalClaimantFileUploadController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AdditionalClaimantFileUploadController();
  });

  // ─── GET ──────────────────────────────────────────────────────────────────

  describe('get', () => {
    it('should render the file upload page', async () => {
      const req = mockRequestWithTranslation({ t }, {});
      const res = mockResponse();

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.ADDITIONAL_CLAIMANT_FILE_UPLOAD,
        expect.objectContaining({ postAddress: PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD })
      );
    });

    it('should pass maxDataRowsForUpload from LaunchDarkly flag', async () => {
      jest.spyOn(launchDarkly, 'getFlagValue').mockResolvedValueOnce(100);
      const req = mockRequestWithTranslation({ t }, {});
      const res = mockResponse();

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.ADDITIONAL_CLAIMANT_FILE_UPLOAD,
        expect.objectContaining({ additionalErrorInfo: 100 })
      );
    });

    it('should default maxDataRowsForUpload to 50 when flag returns null', async () => {
      jest.spyOn(launchDarkly, 'getFlagValue').mockResolvedValueOnce(null);
      const req = mockRequestWithTranslation({ t }, {});
      const res = mockResponse();

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.ADDITIONAL_CLAIMANT_FILE_UPLOAD,
        expect.objectContaining({ additionalErrorInfo: 50 })
      );
    });

    it('should clear additionalClaimantInvalidRows and uploadedFileName from session', async () => {
      const req = mockRequestWithTranslation({ t }, {});
      req.session.additionalClaimantInvalidRows = '2, 3';
      req.session.additionalClaimantUploadedFileName = 'claimants.xlsx';
      const res = mockResponse();

      await controller.get(req, res);

      expect(req.session.additionalClaimantInvalidRows).toBeUndefined();
      expect(req.session.additionalClaimantUploadedFileName).toBeUndefined();
    });
  });

  // ─── POST ─────────────────────────────────────────────────────────────────

  describe('post', () => {
    it('should detect bot submission and return 200', async () => {
      const req = mockRequest({ body: { url: 'http://bot.com' } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalledWith('Thank you for your submission. You will be contacted in due course.');
    });

    it('should set required error and redirect when no spreadsheet on session', async () => {
      const req = mockRequest({ body: {} });
      req.session.userCase.additionalClaimantSpreadsheet = undefined;
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual([
        { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'required' },
      ]);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD);
    });

    it('should redirect to review page when spreadsheet is on session', async () => {
      const req = mockRequest({ body: {} });
      req.session.userCase.additionalClaimantSpreadsheet = mockDocument;
      const res = mockResponse();

      await controller.post(req, res);

      expect(helper.handleUpdateDraftCase).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining(PageUrls.GROUP_REPRESENTATIVE));
    });

    it('should redirect to claim saved when saveForLater is submitted', async () => {
      const req = mockRequest({ body: { saveForLater: true } });
      req.session.userCase.additionalClaimantSpreadsheet = mockDocument;
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
    });
  });

  // ─── POST VALIDATE ────────────────────────────────────────────────────────

  describe('postValidate', () => {
    it('should detect bot submission and return 200', async () => {
      const req = mockRequest({ body: { url: 'http://bot.com' } });
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalledWith('Thank you for your submission. You will be contacted in due course.');
    });

    it('should push invalidFileSize error when file is too large', async () => {
      const req = mockRequest({ body: {}, file: mockFile });
      req.fileTooLarge = true;
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(req.session.errors).toEqual([
        { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'invalidFileSize' },
      ]);
      expect(res.json).toHaveBeenCalledWith({ redirect: PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD });
    });

    it('should push required error when no file is submitted', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(req.session.errors).toEqual([
        { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'required' },
      ]);
      expect(res.json).toHaveBeenCalledWith({ redirect: PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD });
    });

    it('should push invalidFileFormat error when file format is invalid', async () => {
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validatePreconditions').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateFileFormat').mockReturnValueOnce({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'invalidFileFormat',
      });

      const req = mockRequest({ body: {}, file: mockFile });
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(req.session.errors).toEqual([
        { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'invalidFileFormat' },
      ]);
    });

    it('should push fileEmpty error when spreadsheet is empty', async () => {
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validatePreconditions').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateFileFormat').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateSpreadsheet').mockResolvedValueOnce({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'fileEmpty',
      });

      const req = mockRequest({ body: {}, file: mockFile });
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(req.session.errors).toEqual([
        { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'fileEmpty' },
      ]);
    });

    it('should push dataRowsExceedsMax error when too many rows', async () => {
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validatePreconditions').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateFileFormat').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateSpreadsheet').mockResolvedValueOnce({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'dataRowsExceedsMax',
      });

      const req = mockRequest({ body: {}, file: mockFile });
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(req.session.errors).toEqual([
        { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'dataRowsExceedsMax' },
      ]);
    });

    it('should push uploadFailed error when document upload fails', async () => {
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validatePreconditions').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateFileFormat').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateSpreadsheet').mockResolvedValueOnce(null);

      const req = mockRequest({ body: {}, file: mockFile });
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(req.session.errors).toEqual([
        { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'backEndError' },
      ]);
    });

    it('should push mappingError when mapClaimants fails', async () => {
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validatePreconditions').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateFileFormat').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateSpreadsheet').mockResolvedValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'uploadDocument').mockResolvedValueOnce(mockDocument);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'mapClaimants').mockReturnValueOnce({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'mappingError',
      });

      const req = mockRequest({ body: {}, file: mockFile });
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(req.session.errors).toEqual([
        { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'mappingError' },
      ]);
    });

    it('should save document, map claimants and return success on happy path', async () => {
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validatePreconditions').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateFileFormat').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateSpreadsheet').mockResolvedValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'uploadDocument').mockResolvedValueOnce(mockDocument);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'mapClaimants').mockImplementationOnce(req => {
        req.session.userCase.additionalClaimants = mockClaimants;
        return null;
      });

      const req = mockRequest({ body: {}, file: mockFile });
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(req.session.userCase.additionalClaimantSpreadsheet).toEqual(mockDocument);
      expect(req.session.userCase.additionalClaimants).toEqual(mockClaimants);
      expect(res.json).toHaveBeenCalledWith({
        redirect: PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD,
        success: true,
      });
    });

    it('should push backEndError and redirect when an unexpected error is thrown', async () => {
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validatePreconditions').mockReturnValueOnce(null);
      jest.spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateFileFormat').mockReturnValueOnce(null);
      jest
        .spyOn(AdditionalClaimantSpreadsheetService.prototype, 'validateSpreadsheet')
        .mockRejectedValueOnce(new Error('Unexpected failure'));

      const req = mockRequest({ body: {}, file: mockFile });
      const res = mockResponse();

      await controller.postValidate(req, res);

      expect(req.session.errors).toEqual([
        { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'backEndError' },
      ]);
      expect(res.json).toHaveBeenCalledWith({ redirect: PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD });
    });
  });

  // ─── REMOVE ───────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should clear spreadsheet and uploadedFileName from session and redirect', async () => {
      const req = mockRequest({ body: {} });
      req.session.userCase.additionalClaimantSpreadsheet = mockDocument;
      req.session.additionalClaimantUploadedFileName = 'claimants.xlsx';
      const res = mockResponse();

      await controller.remove(req, res);

      expect(req.session.userCase.additionalClaimantSpreadsheet).toBeUndefined();
      expect(req.session.additionalClaimantUploadedFileName).toBeUndefined();
      expect(req.session.errors).toEqual([]);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD);
    });

    it('should handle remove gracefully when userCase is undefined', async () => {
      const req = mockRequest({ body: {} });
      req.session.userCase = undefined;
      const res = mockResponse();

      await controller.remove(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD);
    });
  });
});
