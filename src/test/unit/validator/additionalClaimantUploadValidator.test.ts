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

describe('rowIsInvalid()', () => {
  const map = buildHeaderMap(HEADER_ROW);

  it('returns false for a fully valid row', () => {
    expect(rowIsInvalid(VALID_ROW, map)).toBe(false);
  });

  it('returns false for mandatory-only row', () => {
    expect(rowIsInvalid(MANDATORY_ONLY_ROW, map)).toBe(false);
  });

  describe('title validation', () => {
    it('returns true when title exceeds 25 characters', () => {
      const row = [...VALID_ROW];
      row[0] = 'F'.repeat(26);
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns false when title is exactly 25 characters', () => {
      const row = [...VALID_ROW];
      row[0] = 'A'.repeat(25);
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns false when title is empty', () => {
      const row = [...VALID_ROW];
      row[0] = '';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when title contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[0] = '<script>alert(1)</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when title contains HTML tags', () => {
      const row = [...VALID_ROW];
      row[0] = '<b>Mr</b>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when title contains special characters', () => {
      const row = [...VALID_ROW];
      row[0] = 'Mr; DROP TABLE';
      expect(rowIsInvalid(row, map)).toBe(true);
    });
  });

  describe('firstName validation', () => {
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

    it('returns false for hyphenated first name', () => {
      const row = [...VALID_ROW];
      row[1] = 'Mary-Jane';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns false for name with apostrophe', () => {
      const row = [...VALID_ROW];
      row[1] = "O'Brien";
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns false for Welsh accented name', () => {
      const row = [...VALID_ROW];
      row[1] = 'Siân';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when firstName contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[1] = '<script>alert("xss")</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when firstName contains HTML injection', () => {
      const row = [...VALID_ROW];
      row[1] = '<img src=x onerror=alert(1)>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when firstName contains SQL injection', () => {
      const row = [...VALID_ROW];
      row[1] = "John'; DROP TABLE claimants;--";
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when firstName contains numbers', () => {
      const row = [...VALID_ROW];
      row[1] = 'J0hn';
      expect(rowIsInvalid(row, map)).toBe(true);
    });
  });

  describe('lastName validation', () => {
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

    it('returns false for hyphenated last name', () => {
      const row = [...VALID_ROW];
      row[2] = 'Smith-Jones';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when lastName contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[2] = '<script>alert("xss")</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when lastName contains special characters', () => {
      const row = [...VALID_ROW];
      row[2] = 'Smith@Jones';
      expect(rowIsInvalid(row, map)).toBe(true);
    });
  });

  describe('address1 validation', () => {
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

    it('returns false for address with number and street', () => {
      const row = [...VALID_ROW];
      row[5] = '42 Baker Street';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns false for address with forward slash', () => {
      const row = [...VALID_ROW];
      row[5] = '1/2 High Street';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns false for address with Welsh characters', () => {
      const row = [...VALID_ROW];
      row[5] = '14 Stryd yr Ŵyl';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns false for address with comma and period', () => {
      const row = [...VALID_ROW];
      row[5] = "St. Mary's Road, Apt 3";
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when address1 contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[5] = '<script>alert(1)</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when address1 contains HTML injection', () => {
      const row = [...VALID_ROW];
      row[5] = '<a href="evil.com">click</a>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });
  });

  describe('address2 validation', () => {
    it('returns true when address2 exceeds 50 characters', () => {
      const row = [...VALID_ROW];
      row[6] = 'G'.repeat(51);
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns false when address2 is empty', () => {
      const row = [...VALID_ROW];
      row[6] = '';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when address2 contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[6] = '<script>alert(1)</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });
  });

  describe('town validation', () => {
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

    it('returns false for hyphenated town', () => {
      const row = [...VALID_ROW];
      row[7] = 'Stratford-upon-Avon';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns false for Welsh town name', () => {
      const row = [...VALID_ROW];
      row[7] = 'Llanfairpwllgwyngyll';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when town contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[7] = '<script>alert(1)</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when town contains numbers', () => {
      const row = [...VALID_ROW];
      row[7] = 'London1';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when town contains special characters', () => {
      const row = [...VALID_ROW];
      row[7] = 'London@City';
      expect(rowIsInvalid(row, map)).toBe(true);
    });
  });

  describe('country validation', () => {
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

    it('returns false for valid country', () => {
      const row = [...VALID_ROW];
      row[8] = 'Wales';
      expect(rowIsInvalid(row, map)).toBe(false);
    });

    it('returns true when country contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[8] = '<script>alert(1)</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when country contains numbers', () => {
      const row = [...VALID_ROW];
      row[8] = 'England1';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when country contains hyphens', () => {
      const row = [...VALID_ROW];
      row[8] = 'United-Kingdom';
      expect(rowIsInvalid(row, map)).toBe(true);
    });
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

    it('returns true when dob contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[3] = '<script>alert(1)</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
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

    it('returns true when email contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[4] = '<script>alert(1)</script>@example.com';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it('returns true when email contains javascript protocol', () => {
      const row = [...VALID_ROW];
      row[4] = 'javascript:alert(1)@example.com';
      expect(rowIsInvalid(row, map)).toBe(true);
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

    it('returns true when postcode contains XSS payload', () => {
      const row = [...VALID_ROW];
      row[9] = '<script>alert(1)</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });
  });

  describe('XSS and injection across all fields', () => {
    it.each([
      ['title', 0],
      ['firstName', 1],
      ['lastName', 2],
      ['address1', 5],
      ['address2', 6],
      ['town', 7],
      ['country', 8],
    ])('returns true for script tag injection in %s', (_field, index) => {
      const row = [...VALID_ROW];
      row[index] = '<script>alert("xss")</script>';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it.each([
      ['title', 0],
      ['firstName', 1],
      ['lastName', 2],
      ['address1', 5],
      ['address2', 6],
      ['town', 7],
      ['country', 8],
    ])('returns true for event handler injection in %s', (_field, index) => {
      const row = [...VALID_ROW];
      row[index] = 'foo" onmouseover="alert(1)';
      expect(rowIsInvalid(row, map)).toBe(true);
    });

    it.each([
      ['title', 0],
      ['firstName', 1],
      ['lastName', 2],
      ['address1', 5],
      ['address2', 6],
      ['town', 7],
      ['country', 8],
    ])('returns true for SQL injection attempt in %s', (_field, index) => {
      const row = [...VALID_ROW];
      row[index] = "'; DROP TABLE claimants;--";
      expect(rowIsInvalid(row, map)).toBe(true);
    });
  });
});

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

  it('returns ok with XSS row flagged as invalid', () => {
    const xssRow = [...VALID_ROW];
    xssRow[1] = '<script>alert(1)</script>';
    const buffer = buildBuffer([HEADER_ROW, xssRow]);
    expect(validateSpreadsheetData(buffer, DEFAULT_MAX_ROWS)).toEqual({ status: 'ok', invalidRows: [2] });
  });
});
