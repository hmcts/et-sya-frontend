import { handleUploadDocument } from '../../../../../main/controllers/helpers/CaseHelpers';
import { getAdditionalClaimantSpreadsheetError } from '../../../../../main/controllers/helpers/ErrorHelpers';
import { AdditionalClaimantSpreadsheetService } from '../../../../../main/controllers/helpers/multiples/AdditionalClaimantFileUploadService';
import { fromApiFormatDocument } from '../../../../../main/helper/ApiFormatter';
import * as validator from '../../../../../main/validators/multiples/additionalClaimantUploadValidator';
import { mockFile } from '../../../mocks/mockFile';
import { mockRequest } from '../../../mocks/mockRequest';

jest.mock('../../../../../main/controllers/helpers/CaseHelpers');
jest.mock('../../../../../main/controllers/helpers/ErrorHelpers');
jest.mock('../../../../../main/helper/ApiFormatter');

describe('AdditionalClaimantSpreadsheetService', () => {
  let service: AdditionalClaimantSpreadsheetService;
  let req = mockRequest({});
  const originalGroupClaimsMaxRows = process.env.GROUP_CLAIMS_MAX_ROWS;

  const mockDocument = {
    document_url: 'http://test/doc',
    document_filename: 'claimants.xlsx',
    document_binary_url: 'http://test/doc/binary',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new AdditionalClaimantSpreadsheetService();

    req = mockRequest({
      file: {
        ...mockFile,
        buffer: Buffer.from('test'),
      },
    });

    // Safeguard to ensure session object exists for mapping claimants
    if (!req.session) {
      req.session = {} as never;
    }
    if (!req.session.userCase) {
      req.session.userCase = {} as never;
    }
  });

  describe('validatePreconditions', () => {
    it('should return invalidFileSize when file is too large', () => {
      req.fileTooLarge = true;

      expect(service.validatePreconditions(req)).toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'invalidFileSize',
      });
    });

    it('should return required when file is missing', () => {
      req.file = undefined;

      expect(service.validatePreconditions(req)).toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'required',
      });
    });

    it('should return null when file is valid', () => {
      expect(service.validatePreconditions(req)).toBeNull();
    });
  });

  describe('validateFileFormat', () => {
    it('should return invalidFileFormat when helper returns error', () => {
      (getAdditionalClaimantSpreadsheetError as jest.Mock).mockReturnValue('error');

      expect(service.validateFileFormat(req)).toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'invalidFileFormat',
      });
    });

    it('should return null when format is valid', () => {
      (getAdditionalClaimantSpreadsheetError as jest.Mock).mockReturnValue(null);

      expect(service.validateFileFormat(req)).toBeNull();
    });
  });

  describe('validateSpreadsheet', () => {
    it('should return fileEmpty error', async () => {
      jest.spyOn(validator, 'validateSpreadsheetData').mockResolvedValue({
        status: 'fileEmpty',
      } as never);

      await expect(service.validateSpreadsheet(req)).resolves.toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'fileEmpty',
      });
    });

    it('should return noDataRows error', async () => {
      jest.spyOn(validator, 'validateSpreadsheetData').mockResolvedValue({
        status: 'noDataRows',
      } as never);

      await expect(service.validateSpreadsheet(req)).resolves.toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'noDataRows',
      });
    });

    it('should return dataRowsExceedsMax error', async () => {
      jest.spyOn(validator, 'validateSpreadsheetData').mockResolvedValue({
        status: 'dataRowsExceedsMax',
      } as never);

      await expect(service.validateSpreadsheet(req)).resolves.toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'dataRowsExceedsMax',
      });
    });

    it('should return invalidRowData and set invalid rows', async () => {
      jest.spyOn(validator, 'validateSpreadsheetData').mockResolvedValue({
        status: 'ok',
        invalidRows: [2, 5, 8],
      });

      await expect(service.validateSpreadsheet(req)).resolves.toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'invalidRowData',
        fieldName: '2, 5, 8',
      });

      expect(req.session.additionalClaimantInvalidRows).toBe('2, 5, 8');
    });

    it('should clear invalid rows and return null when spreadsheet is valid', async () => {
      req.session.additionalClaimantInvalidRows = '2, 3';

      jest.spyOn(validator, 'validateSpreadsheetData').mockResolvedValue({
        status: 'ok',
        invalidRows: [],
      });

      await expect(service.validateSpreadsheet(req)).resolves.toBeNull();

      expect(req.session.additionalClaimantInvalidRows).toBeUndefined();
    });

    it('should use configured max rows when present', async () => {
      jest.spyOn(service, 'getMaxDataRowsForUpload').mockReturnValueOnce(100);

      const validateSpy = jest.spyOn(validator, 'validateSpreadsheetData').mockResolvedValue({
        status: 'ok',
        invalidRows: [],
      });

      await service.validateSpreadsheet(req);

      expect(validateSpy).toHaveBeenCalledWith(req.file.buffer, 100);
    });

    it('should default max rows to 50 when config value is invalid', async () => {
      jest.spyOn(service, 'getMaxDataRowsForUpload').mockReturnValueOnce(50);

      const validateSpy = jest.spyOn(validator, 'validateSpreadsheetData').mockResolvedValue({
        status: 'ok',
        invalidRows: [],
      });

      await service.validateSpreadsheet(req);

      expect(validateSpy).toHaveBeenCalledWith(req.file.buffer, 50);
    });
  });

  describe('getMaxDataRowsForUpload', () => {
    afterEach(() => {
      if (originalGroupClaimsMaxRows === undefined) {
        delete process.env.GROUP_CLAIMS_MAX_ROWS;
      } else {
        process.env.GROUP_CLAIMS_MAX_ROWS = originalGroupClaimsMaxRows;
      }
    });

    it('should use GROUP_CLAIMS_MAX_ROWS when it is set', () => {
      process.env.GROUP_CLAIMS_MAX_ROWS = '100';

      expect(service.getMaxDataRowsForUpload()).toBe(100);
    });

    it('should use config max rows when GROUP_CLAIMS_MAX_ROWS is not set', () => {
      delete process.env.GROUP_CLAIMS_MAX_ROWS;

      expect(service.getMaxDataRowsForUpload()).toBe(50);
    });

    it('should fall back to default max rows when GROUP_CLAIMS_MAX_ROWS is invalid', () => {
      process.env.GROUP_CLAIMS_MAX_ROWS = 'not-a-number';

      expect(service.getMaxDataRowsForUpload()).toBe(50);
    });
  });

  describe('uploadDocument', () => {
    it('should return converted document', async () => {
      (handleUploadDocument as jest.Mock).mockResolvedValue({
        data: {
          id: '123',
        },
      });

      (fromApiFormatDocument as jest.Mock).mockReturnValue(mockDocument);

      await expect(service.uploadDocument(req)).resolves.toEqual(mockDocument);
    });

    it('should throw when upload returns no data', async () => {
      (handleUploadDocument as jest.Mock).mockResolvedValue(undefined);

      await expect(service.uploadDocument(req)).rejects.toThrow('Upload failed');
    });
  });
});
