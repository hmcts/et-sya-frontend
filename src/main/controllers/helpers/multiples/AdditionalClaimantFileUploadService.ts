import config from 'config';

import { AppRequest } from '../../../definitions/appRequest';
import { Document } from '../../../definitions/case';
import { fromApiFormatDocument } from '../../../helper/ApiFormatter';
import { getLogger } from '../../../logger';
import {
  FieldErrorType,
  validateSpreadsheetData,
} from '../../../validators/multiples/additionalClaimantUploadValidator';
import { handleUploadDocument } from '../CaseHelpers';
import { getAdditionalClaimantSpreadsheetError } from '../ErrorHelpers';

const logger = getLogger('AdditionalClaimantFileUploadService');
const DEFAULT_MAX_ROWS_FOR_UPLOAD = 50;
const MAX_ROWS_PER_ERROR_TYPE_BEFORE_SUMMARY_MESSAGE = 10;
const MULTIPLE_ERROR_TYPES_SUMMARY_MIN_TYPES = 3;
const SPREADSHEET_PROPERTY_NAME = 'additionalClaimantSpreadsheetName';
type SpreadsheetValidationResult = Awaited<ReturnType<typeof validateSpreadsheetData>>;
type SpreadsheetValidationStatus = SpreadsheetValidationResult['status'];
type NonOkSpreadsheetValidationStatus = Exclude<SpreadsheetValidationStatus, 'ok'>;

export type ValidationError = {
  propertyName: string;
  errorType: string;
  fieldName?: string;
  fieldName2?: string;
};

const ERROR_TYPE_ORDER: FieldErrorType[] = [
  'missingMandatory',
  'invalidTitle',
  'invalidFirstName',
  'invalidLastName',
  'invalidAddressLine1',
  'invalidAddressLine2',
  'invalidTown',
  'invalidCountry',
  'invalidDob',
  'invalidEmail',
  'invalidPostcode',
];

const TOO_MANY_ROWS_ERROR_TYPE_MAP: Record<FieldErrorType, string> = {
  missingMandatory: 'missingMandatoryTooManyRows',
  invalidTitle: 'invalidFieldTooManyRows',
  invalidFirstName: 'invalidFieldTooManyRows',
  invalidLastName: 'invalidFieldTooManyRows',
  invalidAddressLine1: 'invalidFieldTooManyRows',
  invalidAddressLine2: 'invalidFieldTooManyRows',
  invalidTown: 'invalidFieldTooManyRows',
  invalidCountry: 'invalidFieldTooManyRows',
  invalidDob: 'invalidFieldTooManyRows',
  invalidEmail: 'invalidFieldTooManyRows',
  invalidPostcode: 'invalidFieldTooManyRows',
};
const MULTIPLE_ERROR_TYPES_SUMMARY_ERROR_TYPE = 'multipleErrorTypesSummary';
const GENERIC_INVALID_FIELD_SINGLE_ROW_ERROR_TYPE = 'invalidFieldSingleRow';
const GENERIC_INVALID_FIELD_MULTIPLE_ROWS_ERROR_TYPE = 'invalidFieldMultipleRows';
type InvalidFieldErrorType = Exclude<FieldErrorType, 'missingMandatory'>;
const INVALID_FIELD_LABEL_KEY_MAP: Record<InvalidFieldErrorType, string> = {
  invalidTitle: 'title',
  invalidFirstName: 'firstName',
  invalidLastName: 'lastName',
  invalidAddressLine1: 'addressLine1',
  invalidAddressLine2: 'addressLine2',
  invalidTown: 'townOrCity',
  invalidCountry: 'country',
  invalidDob: 'dateOfBirth',
  invalidEmail: 'emailAddress',
  invalidPostcode: 'postcode',
};

// Statuses returned by validateSpreadsheetData that short-circuit with a single, fixed error.
const SIMPLE_STATUS_ERROR_TYPE: Record<NonOkSpreadsheetValidationStatus, string> = {
  fileEmpty: 'fileEmpty',
  noDataRows: 'noDataRows',
  dataRowsExceedsMax: 'dataRowsExceedsMax',
};

export class AdditionalClaimantSpreadsheetService {
  public getMaxDataRowsForUpload(): number {
    const configuredMaxRows = process.env.GROUP_CLAIMS_MAX_ROWS ?? config.get('limits.groupClaimsFileUploadMaxRows');
    const parsedMaxRows = Number(configuredMaxRows);

    return Number.isFinite(parsedMaxRows) && parsedMaxRows > 0 ? parsedMaxRows : DEFAULT_MAX_ROWS_FOR_UPLOAD;
  }

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

  /**
   * Validates every row in the spreadsheet and returns one ValidationError
   * per distinct problem found (e.g. missing mandatory data, invalid DOB,
   * invalid postcode), each carrying its own list of affected row numbers.
   */
  public async validateSpreadsheet(req: AppRequest): Promise<ValidationError[]> {
    if (!req.file) {
      return [this.buildSimpleError('required')];
    }

    const maxDataRowsForUpload = this.getMaxDataRowsForUpload();
    const result = await validateSpreadsheetData(req.file.buffer, maxDataRowsForUpload);
    if (result.status !== 'ok') {
      return [this.buildSimpleError(SIMPLE_STATUS_ERROR_TYPE[result.status])];
    }

    return this.buildRowValidationErrors(result.errorsByType);
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

  /**
   * Builds the full list of row-level ValidationErrors: an optional summary
   * error first (when 3+ distinct problems were found), followed by one
   * error per distinct problem type.
   */
  private buildRowValidationErrors(errorsByType: Partial<Record<FieldErrorType, number[]>>): ValidationError[] {
    const errorTypesWithRows = this.getErrorTypesWithRows(errorsByType);
    const errors = errorTypesWithRows.map(errorType =>
      this.buildErrorForType(errorType, errorsByType[errorType] ?? [])
    );

    if (errorTypesWithRows.length < MULTIPLE_ERROR_TYPES_SUMMARY_MIN_TYPES) {
      return errors;
    }

    return [this.buildSummaryError(errorTypesWithRows, errorsByType), ...errors];
  }

  /**
   * Returns the field error types that actually have affected rows,
   * in fixed display order.
   */
  private getErrorTypesWithRows(errorsByType: Partial<Record<FieldErrorType, number[]>>): FieldErrorType[] {
    return ERROR_TYPE_ORDER.filter(errorType => (errorsByType[errorType]?.length ?? 0) > 0);
  }

  /**
   * Builds the single ValidationError for one error type, choosing between
   * a "too many rows to list" summary and a full row listing depending on
   * how many rows were affected.
   */
  private buildErrorForType(errorType: FieldErrorType, rows: number[]): ValidationError {
    if (rows.length > MAX_ROWS_PER_ERROR_TYPE_BEFORE_SUMMARY_MESSAGE) {
      return this.buildTooManyRowsError(errorType, rows);
    }

    return this.buildListedRowsError(errorType, rows);
  }

  /**
   * Builds a condensed error for when too many rows share the same problem
   * to list individually, e.g. "42 rows are missing mandatory fields".
   */
  private buildTooManyRowsError(errorType: FieldErrorType, rows: number[]): ValidationError {
    const tooManyRowsErrorType = TOO_MANY_ROWS_ERROR_TYPE_MAP[errorType];

    if (errorType === 'missingMandatory') {
      return {
        propertyName: SPREADSHEET_PROPERTY_NAME,
        errorType: tooManyRowsErrorType,
        fieldName: String(rows.length),
      };
    }

    return {
      propertyName: SPREADSHEET_PROPERTY_NAME,
      errorType: tooManyRowsErrorType,
      fieldName: INVALID_FIELD_LABEL_KEY_MAP[errorType],
      fieldName2: String(rows.length),
    };
  }

  /**
   * Builds an error that lists out the specific affected row numbers,
   * e.g. "Postcode is invalid on rows 3, 7, 12".
   */
  private buildListedRowsError(errorType: FieldErrorType, rows: number[]): ValidationError {
    const rowList = rows.join(', ');

    if (errorType === 'missingMandatory') {
      return {
        propertyName: SPREADSHEET_PROPERTY_NAME,
        errorType,
        fieldName: rowList,
      };
    }

    return {
      propertyName: SPREADSHEET_PROPERTY_NAME,
      errorType:
        rows.length === 1
          ? GENERIC_INVALID_FIELD_SINGLE_ROW_ERROR_TYPE
          : GENERIC_INVALID_FIELD_MULTIPLE_ROWS_ERROR_TYPE,
      fieldName: INVALID_FIELD_LABEL_KEY_MAP[errorType],
      fieldName2: rowList,
    };
  }

  /**
   * Builds the leading summary error shown when 3+ distinct problem types
   * were found, e.g. "17 errors found across 12 rows".
   */
  private buildSummaryError(
    errorTypesWithRows: FieldErrorType[],
    errorsByType: Partial<Record<FieldErrorType, number[]>>
  ): ValidationError {
    const totalErrorCount = errorTypesWithRows.reduce(
      (total, errorType) => total + (errorsByType[errorType]?.length ?? 0),
      0
    );
    const affectedRows = new Set<number>(errorTypesWithRows.flatMap(errorType => errorsByType[errorType] ?? [])).size;

    return {
      propertyName: SPREADSHEET_PROPERTY_NAME,
      errorType: MULTIPLE_ERROR_TYPES_SUMMARY_ERROR_TYPE,
      fieldName: String(totalErrorCount),
      fieldName2: String(affectedRows),
    };
  }

  private buildSimpleError(errorType: string): ValidationError {
    return { propertyName: SPREADSHEET_PROPERTY_NAME, errorType };
  }
}
