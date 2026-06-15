import { AppRequest } from '../../../definitions/appRequest';
import { Document } from '../../../definitions/case';
import { fromApiFormatDocument } from '../../../helper/ApiFormatter';
import { getLogger } from '../../../logger';
import { getFlagValue } from '../../../modules/featureFlag/launchDarkly';
import { validateSpreadsheetData } from '../../../validators/multiples/additionalClaimantUploadValidator';
import { handleUploadDocument } from '../CaseHelpers';
import { getAdditionalClaimantSpreadsheetError } from '../ErrorHelpers';

const logger = getLogger('AdditionalClaimantFileUploadService');

export type ValidationError = {
  propertyName: string;
  errorType: string;
  fieldName?: string;
} | null;

export class AdditionalClaimantSpreadsheetService {
  public validatePreconditions(req: AppRequest): ValidationError {
    if (req.fileTooLarge) {
      return { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'invalidFileSize' };
    }

    if (!req.file) {
      return { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'required' };
    }

    return null;
  }

  public validateFileFormat(req: AppRequest): ValidationError {
    const error = getAdditionalClaimantSpreadsheetError(req.file, logger);

    if (error) {
      return { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'invalidFileFormat' };
    }

    return null;
  }

  public async validateSpreadsheet(req: AppRequest): Promise<ValidationError> {
    const maxRowsFlag = await getFlagValue('groupClaimsFileUploadMaxRows', null);
    const maxDataRowsForUpload = maxRowsFlag !== undefined && maxRowsFlag !== null ? Number(maxRowsFlag) : 50;
    const result = await validateSpreadsheetData(req.file!.buffer, maxDataRowsForUpload);

    if (result.status === 'fileEmpty') {
      return { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'fileEmpty' };
    }

    if (result.status === 'noDataRows') {
      return { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'noDataRows' };
    }

    if (result.status === 'dataRowsExceedsMax') {
      return { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'dataRowsExceedsMax' };
    }

    if (result.status === 'ok' && result.invalidRows.length > 0) {
      const joined = result.invalidRows.join(', ');
      req.session.additionalClaimantInvalidRows = joined;

      return {
        propertyName: 'additionalClaimantSpreadsheetName',
        errorType: 'invalidRowData',
        fieldName: joined,
      };
    }

    req.session.additionalClaimantInvalidRows = undefined;
    return null;
  }

  /**
   * Uploads and converts the document into internal format.
   */
  public async uploadDocument(req: AppRequest): Promise<Document> {
    const result = await handleUploadDocument(req, req.file, logger);

    if (!result?.data) {
      throw new Error('Upload failed');
    }

    return fromApiFormatDocument(result.data);
  }
}
