import * as xlsx from 'xlsx';

import {
  buildHeaderMap,
  cellToString,
  rowIsInvalid,
  validateSpreadsheetData,
} from '../../../main/validators/multiples/additionalClaimantUploadValidator';

const buildBuffer = (rows: unknown[][]): Buffer => {
  const ws = xlsx.utils.aoa_to_sheet(rows);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

const HEADER_ROW = [
  'Title',
  'First Name',
  'Last Name',
  'Date of Birth',
  'Email',
  'Address Line 1',
  'Address Line 2',
  'Town',
  'Country',
  'Postcode',
];

const VALID_ROW = [
  'Mr',
  'John',
  'Smith',
  '01/01/1980',
  'john@example.com',
  '1 High Street',
  'Flat 1',
  'London',
  'England',
  'SW1A 1AA',
];
const MANDATORY_ONLY_ROW = ['', 'Jane', 'Doe', '', '', '2 Low Road', '', 'Manchester', 'England', ''];

const DEFAULT_MAX_ROWS = 50;

// ─── cellToString ────────────────────────────────────────────────────────────

describe('cellToString()', () => {
  it('returns empty string for null', () => {
    expect(cellToString(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(cellToString(undefined)).toBe('');
  });

  it('trims whitespace from strings', () => {
    expect(cellToString('  hello  ')).toBe('hello');
  });

  it('converts numbers to string', () => {
    expect(cellToString(42)).toBe('42');
  });

  it('formats a Date as DD/MM/YYYY', () => {
    expect(cellToString(new Date(1990, 5, 15))).toBe('15/06/1990');
  });

  it('pads single digit day and month with leading zero', () => {
    expect(cellToString(new Date(2000, 0, 1))).toBe('01/01/2000');
  });
});

// ─── buildHeaderMap ──────────────────────────────────────────────────────────

describe('buildHeaderMap()', () => {
  it('maps English headers correctly', () => {
    const map = buildHeaderMap(HEADER_ROW);
    expect(map.title).toBe(0);
    expect(map.firstName).toBe(1);
    expect(map.lastName).toBe(2);
    expect(map.dob).toBe(3);
    expect(map.email).toBe(4);
    expect(map.address1).toBe(5);
    expect(map.address2).toBe(6);
    expect(map.town).toBe(7);
    expect(map.country).toBe(8);
    expect(map.postcode).toBe(9);
  });

  it('maps Welsh headers correctly', () => {
    const map = buildHeaderMap([
      'Teitl',
      'EnwCyntaf',
      'Cyfenw',
      'DyddiadGeni',
      'E-Bost',
      'LlinellCyfeiriad1',
      'LlinellCyfeiriad2',
      'Tref',
      'Gwlad',
      'CodPost',
    ]);
    expect(map.title).toBe(0);
    expect(map.firstName).toBe(1);
    expect(map.lastName).toBe(2);
    expect(map.dob).toBe(3);
    expect(map.email).toBe(4);
    expect(map.address1).toBe(5);
    expect(map.address2).toBe(6);
    expect(map.town).toBe(7);
    expect(map.country).toBe(8);
    expect(map.postcode).toBe(9);
  });

  it('maps alternative English headers (first_name, last_name, dob, city)', () => {
    const map = buildHeaderMap([
      'title',
      'first_name',
      'last_name',
      'dob',
      'e-mail',
      'addressline1',
      'addressline2',
      'city',
      'country',
      'postcode',
    ]);
    expect(map.firstName).toBe(1);
    expect(map.lastName).toBe(2);
    expect(map.dob).toBe(3);
    expect(map.email).toBe(4);
    expect(map.town).toBe(7);
  });

  it('is case-insensitive and trims whitespace', () => {
    const map = buildHeaderMap(['  TITLE  ', '  FirstName  ']);
    expect(map.title).toBe(0);
    expect(map.firstName).toBe(1);
  });
});

// ─── rowIsInvalid ─────────────────────────────────────────────────────────────

describe('rowIsInvalid()', () => {
  const map = buildHeaderMap(HEADER_ROW);

  it('returns false for a fully valid row', () => {
    expect(rowIsInvalid(VALID_ROW, map)).toBe(false);
  });

  it('returns false for mandatory-only row', () => {
    expect(rowIsInvalid(MANDATORY_ONLY_ROW, map)).toBe(false);
  });

  it('returns true when firstName is missing', () => {
    const row = [...VALID_ROW];
    row[1] = '';
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when firstName exceeds 100 characters', () => {
    const row = [...VALID_ROW];
    row[1] = 'A'.repeat(101);
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when lastName is missing', () => {
    const row = [...VALID_ROW];
    row[2] = '';
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when lastName exceeds 100 characters', () => {
    const row = [...VALID_ROW];
    row[2] = 'B'.repeat(101);
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when address1 is missing', () => {
    const row = [...VALID_ROW];
    row[5] = '';
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when address1 exceeds 150 characters', () => {
    const row = [...VALID_ROW];
    row[5] = 'C'.repeat(151);
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when town is missing', () => {
    const row = [...VALID_ROW];
    row[7] = '';
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when town exceeds 50 characters', () => {
    const row = [...VALID_ROW];
    row[7] = 'D'.repeat(51);
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when country is missing', () => {
    const row = [...VALID_ROW];
    row[8] = '';
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when country exceeds 50 characters', () => {
    const row = [...VALID_ROW];
    row[8] = 'E'.repeat(51);
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns true when title exceeds 25 characters', () => {
    const row = [...VALID_ROW];
    row[0] = 'F'.repeat(26);
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  it('returns false when title is exactly 25 characters', () => {
    const row = [...VALID_ROW];
    row[0] = 'F'.repeat(25);
    expect(rowIsInvalid(row, map)).toBe(false);
  });

  it('returns true when address2 exceeds 50 characters', () => {
    const row = [...VALID_ROW];
    row[6] = 'G'.repeat(51);
    expect(rowIsInvalid(row, map)).toBe(true);
  });

  describe('dob validation', () => {
    it('returns false when dob is empty', () => {
      const row = [...VALID_ROW];
      row[3] = '';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when dob does not match DD/MM/YYYY', () => {
      const row = [...VALID_ROW];
      row[3] = '1980-01-01';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when dob is an impossible date', () => {
      const row = [...VALID_ROW];
      row[3] = '30/02/1990';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when person is under 16', () => {
      const under16 = new Date();
      under16.setFullYear(under16.getFullYear() - 15);
      const row = [...VALID_ROW];
      row[3] = cellToString(under16);
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns false when person is exactly 16', () => {
      const exactly16 = new Date();
      exactly16.setFullYear(exactly16.getFullYear() - 16);
      const row = [...VALID_ROW];
      row[3] = cellToString(exactly16);
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when person is over 100 years old', () => {
      const over100 = new Date();
      over100.setFullYear(over100.getFullYear() - 101);
      const row = [...VALID_ROW];
      row[3] = cellToString(over100);
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns false when person is exactly 100', () => {
      const exactly100 = new Date();
      exactly100.setFullYear(exactly100.getFullYear() - 100);
      const row = [...VALID_ROW];
      row[3] = cellToString(exactly100);
      expect(rowIsInvalid(row, map)).toBe(false);
    });
  });

  describe('email validation', () => {
    it('returns false when email is empty', () => {
      const row = [...VALID_ROW];
      row[4] = '';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when email exceeds 100 characters', () => {
      const row = [...VALID_ROW];
      row[4] = `${'a'.repeat(90)}@example.com`;
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true for invalid email format', () => {
      const row = [...VALID_ROW];
      row[4] = 'not-an-email';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true for email missing domain', () => {
      const row = [...VALID_ROW];
      row[4] = 'user@';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns false for valid email', () => {
      const row = [...VALID_ROW];
      row[4] = 'valid.email+tag@example.co.uk';
      expect(rowIsInvalid(row, map)).toBe(false);
    });
  });

  describe('postcode validation', () => {
    it('returns false when postcode is empty', () => {
      const row = [...VALID_ROW];
      row[9] = '';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when postcode exceeds 14 characters', () => {
      const row = [...VALID_ROW];
      row[9] = 'SW1A 1AA EXTRA';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true for invalid postcode format', () => {
      const row = [...VALID_ROW];
      row[9] = 'INVALID';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns false for postcode with space', () => {
      const row = [...VALID_ROW];
      row[9] = 'SW1A 1AA';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns false for postcode without space', () => {
      const row = [...VALID_ROW];
      row[9] = 'SW1A1AA';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns false for valid postcode lowercase', () => {
      const row = [...VALID_ROW];
      row[9] = 'sw1a 1aa';
      expect(rowIsInvalid(row, map)).toBe(false);
    });
  });
});

// ─── validateSpreadsheetData ──────────────────────────────────────────────────

describe('validateSpreadsheetData()', () => {
  it('returns fileEmpty when spreadsheet has no rows', () => {
    const buffer = buildBuffer([]);
    expect(validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS)).toEqual({ status: 'fileEmpty' });
  });

  it('returns fileEmpty when all rows are blank', () => {
    const buffer = buildBuffer([
      ['', '', ''],
      ['', '', ''],
    ]);
    expect(validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS)).toEqual({ status: 'fileEmpty' });
  });

  it('returns noDataRows when only header row is present', () => {
    const buffer = buildBuffer([HEADER_ROW]);
    expect(validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS)).toEqual({ status: 'noDataRows' });
  });

  it('returns dataRowsExceedsMax when rows exceed maxDataRowsForUpload', () => {
    const rows = [HEADER_ROW, ...Array(51).fill(VALID_ROW)];
    const buffer = buildBuffer(rows);
    expect(validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS)).toEqual({ status: 'dataRowsExceedsMax' });
  });

  it('respects a custom maxDataRowsForUpload', () => {
    const rows = [HEADER_ROW, ...Array(6).fill(VALID_ROW)];
    const buffer = buildBuffer(rows);
    expect(validateSpreadsheetData(buffer, 5)).toEqual({ status: 'dataRowsExceedsMax' });
  });

  it('does not exceed max when rows equal maxDataRowsForUpload', () => {
    const rows = [HEADER_ROW, ...Array(50).fill(VALID_ROW)];
    const buffer = buildBuffer(rows);
    const result = validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS);
    expect(result.status).toBe('ok');
  });

  it('returns ok with no invalid rows for a valid spreadsheet', () => {
    const buffer = buildBuffer([HEADER_ROW, VALID_ROW]);
    expect(validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS)).toEqual({ status: 'ok', invalidRows: [] });
  });

  it('returns ok with no invalid rows for mandatory-only row', () => {
    const buffer = buildBuffer([HEADER_ROW, MANDATORY_ONLY_ROW]);
    expect(validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS)).toEqual({ status: 'ok', invalidRows: [] });
  });

  it('returns ok with invalid row numbers for failing rows', () => {
    const invalidRow = [...VALID_ROW];
    invalidRow[1] = '';
    const buffer = buildBuffer([HEADER_ROW, VALID_ROW, invalidRow]);
    expect(validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS)).toEqual({ status: 'ok', invalidRows: [3] });
  });

  it('returns multiple invalid row numbers when multiple rows fail', () => {
    const invalidRow1 = [...VALID_ROW];
    invalidRow1[1] = '';
    const invalidRow2 = [...VALID_ROW];
    invalidRow2[2] = '';
    const buffer = buildBuffer([HEADER_ROW, VALID_ROW, invalidRow1, invalidRow2]);
    expect(validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS)).toEqual({ status: 'ok', invalidRows: [3, 4] });
  });
});
