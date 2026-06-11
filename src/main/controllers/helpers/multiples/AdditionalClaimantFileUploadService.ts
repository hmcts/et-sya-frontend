import * as xlsx from 'xlsx';

import { AppRequest } from '../../../definitions/appRequest';
import { AdditionalClaimant, CaseDate, Document } from '../../../definitions/case';
import { fromApiFormatDocument } from '../../../helper/ApiFormatter';
import { getLogger } from '../../../logger';
import { getFlagValue } from '../../../modules/featureFlag/launchDarkly';
import {
  buildHeaderMap,
  cellToString,
  validateSpreadsheetData,
} from '../../../validators/multiples/additionalClaimantUploadValidator';
import { handleUploadDocument } from '../CaseHelpers';
import { getAdditionalClaimantSpreadsheetError } from '../ErrorHelpers';

const logger = getLogger('AdditionalClaimantFileUploadService');

type FieldKey =
  | 'title'
  | 'firstName'
  | 'lastName'
  | 'dob'
  | 'email'
  | 'address1'
  | 'address2'
  | 'town'
  | 'country'
  | 'postcode';

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
    const result = validateSpreadsheetData(req.file!.buffer, maxDataRowsForUpload);

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

  public mapClaimants(req: AppRequest): ValidationError {
    try {
      const workbook = xlsx.read(req.file!.buffer, { type: 'buffer', cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const allRows = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        raw: true,
      }) as unknown[][];

      const rows = allRows.filter(row => row.some(cell => cellToString(cell) !== ''));
      const headerMap = buildHeaderMap(rows[0]);
      const claimants: AdditionalClaimant[] = rows.slice(1).map(row => this.mapRowToAdditionalClaimant(row, headerMap));

      if (!claimants.length) {
        return { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'mappingError' };
      }

      req.session.userCase.additionalClaimants = claimants;
      return null;
    } catch (error) {
      logger.error(error);
      return { propertyName: 'additionalClaimantSpreadsheetName', errorType: 'mappingError' };
    }
  }

  private mapRowToAdditionalClaimant(row: unknown[], map: Record<FieldKey, number>): AdditionalClaimant {
    const rawDob = this.getCell(row, map, 'dob');
    let dob: CaseDate | undefined;

    if (rawDob) {
      const [day, month, year] = rawDob.split('/');
      dob = { day, month, year };
    }

    return {
      title: this.getCell(row, map, 'title') || undefined,
      firstName: this.getCell(row, map, 'firstName') || undefined,
      lastName: this.getCell(row, map, 'lastName') || undefined,
      email: this.getCell(row, map, 'email') || undefined,
      dob,
      address: {
        AddressLine1: this.getCell(row, map, 'address1') || undefined,
        AddressLine2: this.getCell(row, map, 'address2') || undefined,
        PostTown: this.getCell(row, map, 'town') || undefined,
        Country: this.getCell(row, map, 'country') || undefined,
        PostCode: this.getCell(row, map, 'postcode') || undefined,
      },
    };
  }

  private getCell(row: unknown[], map: Record<FieldKey, number>, key: FieldKey): string {
    const idx = map[key];
    return idx === undefined ? '' : cellToString(row[idx]);
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
