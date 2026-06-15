import * as xlsx from 'xlsx';

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

/**
 * Normalises a spreadsheet header by trimming, lowercasing, and removing spaces.
 */
const normaliseHeader = (header: string): string => {
  return header.trim().toLowerCase().replace(/\s+/g, '');
};

/**
 * Builds a map of known field keys to their column indexes based on the header row.
 */
export const buildHeaderMap = (headerRow: unknown[]): Record<FieldKey, number> => {
  const map: Partial<Record<FieldKey, number>> = {};

  headerRow.forEach((cell, index) => {
    const value = normaliseHeader(cellToString(cell));

    switch (value) {
      case 'title':
      case 'teitl': {
        map.title = index;
        break;
      }

      case 'firstname':
      case 'first_name':
      case 'enwcyntaf': {
        map.firstName = index;
        break;
      }

      case 'lastname':
      case 'last_name':
      case 'cyfenw': {
        map.lastName = index;
        break;
      }

      case 'dateofbirth':
      case 'dob':
      case 'dyddiadgeni': {
        map.dob = index;
        break;
      }

      case 'email':
      case 'e-mail':
      case 'e-bost':
      case 'ebost': {
        map.email = index;
        break;
      }

      case 'addressline1':
      case 'llinellcyfeiriad1': {
        map.address1 = index;
        break;
      }

      case 'addressline2':
      case 'llinellcyfeiriad2': {
        map.address2 = index;
        break;
      }

      case 'town':
      case 'city':
      case 'townorcity':
      case 'trefneuddinas':
      case 'dinas':
      case 'tref': {
        map.town = index;
        break;
      }

      case 'country':
      case 'gwlad': {
        map.country = index;
        break;
      }

      case 'postcode':
      case 'codpost': {
        map.postcode = index;
        break;
      }
    }
  });

  return map as Record<FieldKey, number>;
};

/**
 * Internal helper: retrieves a typed value from a row using the header map.
 */
const get = (row: unknown[], map: Record<FieldKey, number>, key: FieldKey): string => {
  const idx = map[key];

  if (idx === undefined) {
    return '';
  }

  return cellToString(row[idx]);
};

/**
 * Converts a spreadsheet cell into a safe string representation.
 */
export const cellToString = (cell: unknown): string => {
  if (cell === null || cell === undefined) {
    return '';
  }

  if (cell instanceof Date) {
    const dd = String(cell.getDate()).padStart(2, '0');
    const mm = String(cell.getMonth() + 1).padStart(2, '0');

    return `${dd}/${mm}/${cell.getFullYear()}`;
  }

  return String(cell).trim();
};

const NAME_PATTERN = /^[\p{L}\p{M}'\- ]+$/u;
const ADDRESS_PATTERN = /^[\p{L}\p{M}\p{N}'\-.,/ ]+$/u;
const TOWN_PATTERN = /^[\p{L}\p{M}'\- ]+$/u;
const COUNTRY_PATTERN = /^[\p{L}\p{M} ]+$/u;
const DOB_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const POSTCODE_PATTERN = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;

/**
 * Validates a single spreadsheet row against business rules.
 */
export const rowIsInvalid = (row: unknown[], map: Record<FieldKey, number>): boolean => {
  const title = get(row, map, 'title');
  const firstName = get(row, map, 'firstName');
  const lastName = get(row, map, 'lastName');
  const dob = get(row, map, 'dob');
  const email = get(row, map, 'email');
  const addrLine1 = get(row, map, 'address1');
  const addrLine2 = get(row, map, 'address2');
  const town = get(row, map, 'town');
  const country = get(row, map, 'country');
  const postcode = get(row, map, 'postcode');

  if (title) {
    if (title.length > 25) {
      return true;
    }
    if (!NAME_PATTERN.test(title)) {
      return true;
    }
  }

  if (!firstName || firstName.length > 100 || !NAME_PATTERN.test(firstName)) {
    return true;
  }

  if (!lastName || lastName.length > 100 || !NAME_PATTERN.test(lastName)) {
    return true;
  }

  if (!addrLine1 || addrLine1.length > 150 || !ADDRESS_PATTERN.test(addrLine1)) {
    return true;
  }

  if (addrLine2 && (addrLine2.length > 50 || !ADDRESS_PATTERN.test(addrLine2))) {
    return true;
  }

  if (!town || town.length > 50 || !TOWN_PATTERN.test(town)) {
    return true;
  }

  if (!country || country.length > 50 || !COUNTRY_PATTERN.test(country)) {
    return true;
  }

  if (dob) {
    const match = DOB_PATTERN.exec(dob);

    if (!match) {
      return true;
    }

    const day = Number.parseInt(match[1], 10);
    const month = Number.parseInt(match[2], 10) - 1;
    const year = Number.parseInt(match[3], 10);

    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return true;
    }

    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    const maxAgeDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

    if (date > minAgeDate) {
      return true;
    }

    if (date < maxAgeDate) {
      return true;
    }
  }

  if (email) {
    if (email.length > 100) {
      return true;
    }

    if (!EMAIL_PATTERN.test(email)) {
      return true;
    }
  }

  if (postcode) {
    if (postcode.length > 14) {
      return true;
    }

    if (!POSTCODE_PATTERN.test(postcode)) {
      return true;
    }
  }

  return false;
};

type SpreadsheetValidationResult =
  | { status: 'ok'; invalidRows: number[] }
  | { status: 'fileEmpty' }
  | { status: 'noDataRows' }
  | { status: 'dataRowsExceedsMax' };

/**
 * Validates spreadsheet buffer and returns row numbers that fail validation.
 */
export const validateSpreadsheetData = (buffer: Buffer, maxDataRowsForUpload: number): SpreadsheetValidationResult => {
  const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const allRows = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    raw: true,
  }) as unknown[][];

  const rows = allRows.filter(row => {
    return row.some(cell => {
      return cellToString(cell) !== '';
    });
  });

  if (rows.length === 0) {
    return { status: 'fileEmpty' };
  }

  const dataRows = rows.slice(1);
  if (dataRows.length === 0) {
    return { status: 'noDataRows' };
  } else if (dataRows.length > maxDataRowsForUpload) {
    return { status: 'dataRowsExceedsMax' };
  }

  const invalidNums: number[] = [];
  const headerMap = buildHeaderMap(rows[0]);

  dataRows.forEach((row, idx) => {
    const spreadsheetRow = idx + 2;

    if (rowIsInvalid(row, headerMap)) {
      invalidNums.push(spreadsheetRow);
    }
  });

  return {
    status: 'ok',
    invalidRows: invalidNums,
  };
};
