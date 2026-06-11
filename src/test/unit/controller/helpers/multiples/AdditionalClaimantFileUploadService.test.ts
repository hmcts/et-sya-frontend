import * as xlsx from 'xlsx';

import { handleUploadDocument } from '../../../../../main/controllers/helpers/CaseHelpers';
import { getAdditionalClaimantSpreadsheetError } from '../../../../../main/controllers/helpers/ErrorHelpers';
import { AdditionalClaimantSpreadsheetService } from '../../../../../main/controllers/helpers/multiples/AdditionalClaimantFileUploadService';
import { fromApiFormatDocument } from '../../../../../main/helper/ApiFormatter';
import * as launchDarkly from '../../../../../main/modules/featureFlag/launchDarkly';
import * as validator from '../../../../../main/validators/multiples/additionalClaimantUploadValidator';
import { mockFile } from '../../../mocks/mockFile';
import { mockRequest } from '../../../mocks/mockRequest';

// Fix: Explicitly structure the xlsx mock so nested objects like `utils` are not undefined
jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}));
jest.mock('../../../../../main/controllers/helpers/CaseHelpers');
jest.mock('../../../../../main/controllers/helpers/ErrorHelpers');
jest.mock('../../../../../main/helper/ApiFormatter');

describe('AdditionalClaimantSpreadsheetService', () => {
  let service: AdditionalClaimantSpreadsheetService;
  let req = mockRequest({});

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
    beforeEach(() => {
      jest.spyOn(launchDarkly, 'getFlagValue').mockResolvedValue(50);
    });

    it('should return fileEmpty error', async () => {
      jest.spyOn(validator, 'validateSpreadsheetData').mockReturnValue({
        status: 'fileEmpty',
      } as never);

      await expect(service.validateSpreadsheet(req)).resolves.toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'fileEmpty',
      });
    });

    it('should return noDataRows error', async () => {
      jest.spyOn(validator, 'validateSpreadsheetData').mockReturnValue({
        status: 'noDataRows',
      } as never);

      await expect(service.validateSpreadsheet(req)).resolves.toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'noDataRows',
      });
    });

    it('should return dataRowsExceedsMax error', async () => {
      jest.spyOn(validator, 'validateSpreadsheetData').mockReturnValue({
        status: 'dataRowsExceedsMax',
      } as never);

      await expect(service.validateSpreadsheet(req)).resolves.toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'dataRowsExceedsMax',
      });
    });

    it('should return invalidRowData and set invalid rows', async () => {
      jest.spyOn(validator, 'validateSpreadsheetData').mockReturnValue({
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

      jest.spyOn(validator, 'validateSpreadsheetData').mockReturnValue({
        status: 'ok',
        invalidRows: [],
      });

      await expect(service.validateSpreadsheet(req)).resolves.toBeNull();

      expect(req.session.additionalClaimantInvalidRows).toBeUndefined();
    });

    it('should use LaunchDarkly value when present', async () => {
      jest.spyOn(launchDarkly, 'getFlagValue').mockResolvedValueOnce(100);

      const validateSpy = jest.spyOn(validator, 'validateSpreadsheetData').mockReturnValue({
        status: 'ok',
        invalidRows: [],
      });

      await service.validateSpreadsheet(req);

      expect(validateSpy).toHaveBeenCalledWith(req.file.buffer, 100);
    });

    it('should default max rows to 50 when LaunchDarkly returns null', async () => {
      jest.spyOn(launchDarkly, 'getFlagValue').mockResolvedValueOnce(null);

      const validateSpy = jest.spyOn(validator, 'validateSpreadsheetData').mockReturnValue({
        status: 'ok',
        invalidRows: [],
      });

      await service.validateSpreadsheet(req);

      expect(validateSpy).toHaveBeenCalledWith(req.file.buffer, 50);
    });
  });

  describe('mapClaimants', () => {
    // Fix: Mock the validator helpers so they accurately parse your dummy array
    beforeEach(() => {
      jest.spyOn(validator, 'cellToString').mockImplementation((val: never) => (val ? String(val) : ''));
      jest.spyOn(validator, 'buildHeaderMap').mockReturnValue({
        firstName: 0,
        lastName: 1,
        dob: 2,
        address1: 3,
        town: 4,
        country: 5,
      } as never);
    });

    it('should map spreadsheet rows to additional claimants', () => {
      (xlsx.read as jest.Mock).mockReturnValue({
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      });

      (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue([
        ['First Name', 'Last Name', 'Date Of Birth', 'Address Line 1', 'Town', 'Country'],
        ['John', 'Smith', '01/02/1990', '1 High Street', 'London', 'England'],
      ]);

      const result = service.mapClaimants(req);

      expect(result).toBeNull();

      expect(req.session.userCase.additionalClaimants).toEqual([
        {
          title: undefined,
          firstName: 'John',
          lastName: 'Smith',
          email: undefined,
          dob: {
            day: '01',
            month: '02',
            year: '1990',
          },
          address: {
            AddressLine1: '1 High Street',
            AddressLine2: undefined,
            PostTown: 'London',
            Country: 'England',
            PostCode: undefined,
          },
        },
      ]);
    });

    it('should return mappingError when no claimants exist', () => {
      (xlsx.read as jest.Mock).mockReturnValue({
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      });

      (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue([['First Name', 'Last Name']]);

      expect(service.mapClaimants(req)).toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'mappingError',
      });
    });

    it('should return mappingError when spreadsheet parsing throws', () => {
      (xlsx.read as jest.Mock).mockImplementation(() => {
        throw new Error('Spreadsheet error');
      });

      expect(service.mapClaimants(req)).toEqual({
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'mappingError',
      });
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
