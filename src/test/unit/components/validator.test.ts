import {
  arePayValuesNull,
  atLeastOneFieldIsChecked,
  hasInvalidFileFormat,
  hasInvalidName,
  isAcasNumberValid,
  isContent100CharsOrLess,
  isContent2500CharsOrLess,
  isContentBetween3And100Chars,
  isFieldFilledIn,
  isJobTitleValid,
  isOptionSelected,
  isPayIntervalNull,
  isRespondentNameValid,
  isValidAvgWeeklyHours,
  isValidNoticeLength,
  isValidTwoDigitInteger,
  isValidUKTelNumber,
  validateTitlePreference,
} from '../../../main/components/form/validator';
import { mockFile } from '../mocks/mockFile';

describe('Validation', () => {
  describe('isFieldFilledIn()', () => {
    it('Should check if value exist', () => {
      const isValid = isFieldFilledIn('Yes');

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      const isValid = isFieldFilledIn(undefined);

      expect(isValid).toStrictEqual('required');
    });

    it('Should check if value is only whitespaces', () => {
      const isValid = isFieldFilledIn('    ');

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('isRespondentNameValid()', () => {
    it.each([
      { name: 'Test Respondent Name', result: undefined },
      { name: undefined, result: 'required' },
      { name: '     ', result: 'required' },
      { name: 'a'.repeat(101), result: 'invalidLength' },
    ])('check respondent name passes validation: %o', ({ name, result }) => {
      const isValid = isRespondentNameValid(name);

      expect(isValid).toStrictEqual(result);
    });
  });

  describe('isContent2500CharsOrLess()', () => {
    it('should not warn when content is 2500 characters or less', () => {
      expect(isContent2500CharsOrLess(undefined)).toStrictEqual(undefined);
      expect(isContent2500CharsOrLess('')).toStrictEqual(undefined);
      expect(isContent2500CharsOrLess('1'.repeat(2500))).toStrictEqual(undefined);
    });

    it('should warn when content longer than 2500 characters', () => {
      expect(isContent2500CharsOrLess('1'.repeat(2501))).toStrictEqual('tooLong');
    });
  });

  describe('isContentBetween3And100Chars()', () => {
    it('should not warn when content is valid length', () => {
      expect(isContentBetween3And100Chars('abc')).toStrictEqual(undefined);
      expect(isContentBetween3And100Chars('1'.repeat(100))).toStrictEqual(undefined);
    });

    it('should warn when content shorter than 3 characters', () => {
      expect(isContentBetween3And100Chars('12')).toStrictEqual('invalidLength');
    });

    it('should warn when content longer than 100 characters', () => {
      expect(isContentBetween3And100Chars('1'.repeat(101))).toStrictEqual('invalidLength');
    });
  });

  describe('isOptionSelected()', () => {
    it('Should correctly identify an option was selected', () => {
      expect(isOptionSelected('anything')).toStrictEqual(undefined);
    });

    it('Should correctly identify an option was not selected', () => {
      expect(isOptionSelected('notSelected')).toStrictEqual('required');
    });
  });

  describe('atLeastOneFieldIsChecked()', () => {
    it('Should check if value exist', () => {
      const isValid = atLeastOneFieldIsChecked(['Yes']);

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      const isValid = atLeastOneFieldIsChecked([]);

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('validateTitlePreference()', () => {
    it.each([
      { title: '', expectedError: undefined },
      { title: 'ab', expectedError: undefined },
      { title: 'a', expectedError: 'lengthError' },
      { title: 'a1', expectedError: 'numberError' },
      { title: ' 12', expectedError: 'numberError' },
      { title: '1a', expectedError: 'numberError' },
    ])('Should check if other title preference is valid: %o', ({ title, expectedError }) => {
      const isValid = validateTitlePreference(title);
      expect(isValid).toStrictEqual(expectedError);
    });
  });
  describe('isValidUKTelNumber()', () => {
    it.each([
      { mockRef: '', expected: undefined },
      { mockRef: null, expected: undefined },
      { mockRef: '12345', expected: 'invalid' },
      { mockRef: '@£$£@$%', expected: 'nonnumeric' },
      { mockRef: 'not a phone number', expected: 'nonnumeric' },
      { mockRef: '01234!567890', expected: 'nonnumeric' },
      { mockRef: '00361234567890', expected: 'invalid' },
      { mockRef: '1234567890', expected: 'invalid' },
      { mockRef: '01234 567 890', expected: undefined },
      { mockRef: '01234 567890', expected: undefined },
      { mockRef: '+441234567890', expected: undefined },
      { mockRef: '00441234567890', expected: 'invalid' },
      { mockRef: '004401234567890', expected: 'invalid' },
      { mockRef: '01234567890', expected: undefined },
      { mockRef: '+44 (07500) 900 983', expected: 'invalid' },
      { mockRef: '(01629) 900 983', expected: undefined },
      { mockRef: '01234567B90', expected: 'nonnumeric' },
    ])('check telephone number validity when %o', ({ mockRef, expected }) => {
      expect(isValidUKTelNumber(mockRef)).toEqual(expected);
    });
  });

  describe('isJobTitleValid()', () => {
    it.each([
      { mockRef: '', expected: undefined },
      { mockRef: null, expected: undefined },
      { mockRef: 'a', expected: 'invalid-length' },
      {
        mockRef:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et al.',
        expected: 'invalid-length',
      },
      { mockRef: 'CEO', expected: undefined },
      { mockRef: 'Developer', expected: undefined },
      { mockRef: 'ex-mayor', expected: undefined },
      { mockRef: 'Lorry Driver', expected: undefined },
      { mockRef: 'I.T. technician', expected: undefined },
      { mockRef: 'Manager', expected: undefined },
    ])('check job title is valid', ({ mockRef, expected }) => {
      expect(isJobTitleValid(mockRef)).toEqual(expected);
    });
  });

  describe('isValidTwoDigitInteger()', () => {
    it.each([
      { mockRef: '', expected: 'invalid' },
      { mockRef: null, expected: 'invalid' },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '2a', expected: 'notANumber' },
      { mockRef: '20', expected: undefined },
    ])('check two digit input is valid', ({ mockRef, expected }) => {
      expect(isValidTwoDigitInteger(mockRef)).toEqual(expected);
    });
  });

  describe('isValidNoticeLength()', () => {
    it.each([
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '2a', expected: 'notANumber' },
    ])('check notice length is valid', ({ mockRef, expected }) => {
      expect(isValidNoticeLength(mockRef)).toEqual(expected);
    });
  });

  describe('isValidAvgWeeklyHours()', () => {
    it.each([
      { mockRef: '00', expected: 'invalid' },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '25a', expected: 'notANumber' },
      { mockRef: '20.00', expected: undefined },
      { mockRef: '169', expected: 'exceeded' },
      { mockRef: '-4', expected: 'negativeNumber' },
      { mockRef: '35', expected: undefined },
      { mockRef: '2', expected: undefined },
      { mockRef: '.25', expected: 'invalid' },
      { mockRef: '-1', expected: 'negativeNumber' },
      { mockRef: null, expected: undefined },
    ])('check integer input is valid', ({ mockRef, expected }) => {
      expect(isValidAvgWeeklyHours(mockRef)).toEqual(expected);
    });
  });

  describe('isPayIntervalNull()', () => {
    it('Should check if value exists', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const isValid = isPayIntervalNull('Weekly' || 'Monthly' || 'Annual');
      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      const value = '';
      const isValid = isPayIntervalNull(value);
      expect(isValid).toStrictEqual('required');
    });
  });

  describe('arePayValuesNull()', () => {
    it('Should check if pay values exists', () => {
      const isValid = arePayValuesNull(['123', '123']);
      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if pay values do not exist', () => {
      const value = ['', ''];
      const isValid = arePayValuesNull(value);
      expect(isValid).toStrictEqual('required');
    });
  });

  describe('hasValidFileFormat()', () => {
    it.each([
      { fileName: undefined, expected: undefined },
      { fileName: '', expected: undefined },
      { fileName: '.csv', expected: undefined },
      { fileName: '..csv', expected: undefined },
      { fileName: 'file.csv', expected: undefined },
      { fileName: 'file.pdf', expected: undefined },
      { fileName: 'file.doc', expected: undefined },
      { fileName: 'file.docx', expected: undefined },
      { fileName: 'file.txt', expected: undefined },
      { fileName: 'file.dot', expected: undefined },
      { fileName: 'file.jpg', expected: undefined },
      { fileName: 'file.jpeg', expected: undefined },
      { fileName: 'file.bmp', expected: undefined },
      { fileName: 'file.tif', expected: undefined },
      { fileName: 'file.tiff', expected: undefined },
      { fileName: 'file.png', expected: undefined },
      { fileName: 'file.xls', expected: undefined },
      { fileName: 'file.xlt', expected: undefined },
      { fileName: 'file.xla', expected: undefined },
      { fileName: 'file.xlsx', expected: undefined },
      { fileName: 'file.xltx', expected: undefined },
      { fileName: 'file.xlsb', expected: 'invalidFileFormat' },
      { fileName: 'file.ppt', expected: undefined },
      { fileName: 'file.pot', expected: undefined },
      { fileName: 'file.pps', expected: undefined },
      { fileName: 'file.ppa', expected: undefined },
      { fileName: 'file.pptx', expected: undefined },
      { fileName: 'file.potx', expected: undefined },
      { fileName: 'file.ppsx', expected: undefined },
      { fileName: 'file.rtf', expected: undefined },
      { fileName: 'file Copy(0).csv', expected: undefined },
      { fileName: 'file_with_underscore.txt', expected: undefined },
      { fileName: 'file.file.csv', expected: undefined },
      { fileName: 'file.csv.csv', expected: undefined },
      { fileName: 'file.msg', expected: 'invalidFileFormat' },
      { fileName: 'file.csv.msg', expected: 'invalidFileFormat' },
      { fileName: 'file.json', expected: 'invalidFileFormat' },
      { fileName: 'file', expected: 'invalidFileFormat' },
      { fileName: 'file.pfsz', expected: 'invalidFileFormat' },
      { fileName: 'file.pj', expected: 'invalidFileFormat' },
      { fileName: 'file.gjp', expected: 'invalidFileFormat' },
      { fileName: 'csv', expected: 'invalidFileFormat' },
      { fileName: 'file.', expected: 'invalidFileFormat' },
      { fileName: 'file.invalidFormat', expected: 'invalidFileFormat' },
    ])('Check file format %o', ({ fileName, expected }) => {
      const newFile = mockFile;
      newFile.originalname = fileName;
      expect(hasInvalidFileFormat(newFile, undefined)).toEqual(expected);
    });
    it.each([
      { fileName: 'file Copy(0).csv', expected: undefined },
      { fileName: 'file_with_underscore.txt', expected: undefined },
      { fileName: 'file.file.csv', expected: undefined },
      { fileName: 'file.csv.csv', expected: undefined },
      { fileName: 'file?.csv', expected: 'invalidFileName' },
      { fileName: 'file<1>.csv', expected: 'invalidFileName' },
    ])('Check filename %o', ({ fileName, expected }) => {
      expect(hasInvalidName(fileName)).toEqual(expected);
    });
  });
  describe('isAcasNumberValid()', () => {
    it('Should check if value does not exist', () => {
      const isValid = isAcasNumberValid(undefined);

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if value is only whitespaces', () => {
      const isValid = isAcasNumberValid('    ');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if value has more than 11 characters', () => {
      const isValid = isAcasNumberValid('R123456/89');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if value has less than 14 characters', () => {
      const isValid = isAcasNumberValid('R123456/890123');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if value starts with R or MU', () => {
      const beginsWithT = isAcasNumberValid('T123458/89/13');
      const beginsWithQ = isAcasNumberValid('q123456/78/12');
      const beginsWithDigit = isAcasNumberValid('1234556/79/12');

      expect(beginsWithT).toStrictEqual('invalidAcasNumber');
      expect(beginsWithQ).toStrictEqual('invalidAcasNumber');
      expect(beginsWithDigit).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if has any numeric or / character after R or MU', () => {
      const invalidAfterR = isAcasNumberValid('R12345/789a12');
      const invalidAfterMU = isAcasNumberValid('MU12345/789a12');

      expect(invalidAfterR).toStrictEqual('invalidAcasNumber');
      expect(invalidAfterMU).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if has any repeating / character like //', () => {
      const isValid = isAcasNumberValid('R145//9123112');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if has any repeating / character like ///', () => {
      const isValid = isAcasNumberValid('R145///123112');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if has / character at the end', () => {
      const isValid = isAcasNumberValid('R145123112/');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should not allow incorrect number of characters in the first digit block', () => {
      const fiveDigits = isAcasNumberValid('R12345/78/12');
      const sevenDigits = isAcasNumberValid('R1234567/78/12');

      expect(fiveDigits).toStrictEqual('invalidAcasNumber');
      expect(sevenDigits).toStrictEqual('invalidAcasNumber');
    });

    it('Should not allow incorrect number of digits in the middle digit block', () => {
      const oneDigit = isAcasNumberValid('R123456/321/12');
      const threeDigits = isAcasNumberValid('R123456/7/12');

      expect(oneDigit).toStrictEqual('invalidAcasNumber');
      expect(threeDigits).toStrictEqual('invalidAcasNumber');
    });
    it('Should not allow incorrect number of digits in the last digit block', () => {
      const oneDigit = isAcasNumberValid('R123456/32/1');
      const threeDigits = isAcasNumberValid('R123456/47/124');

      expect(oneDigit).toStrictEqual('invalidAcasNumber');
      expect(threeDigits).toStrictEqual('invalidAcasNumber');
    });
    it('Should not allow the slashes in any position', () => {
      const isValid = isAcasNumberValid('R123/45678/12');
      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should allow a small r at the beginning', () => {
      const isValid = isAcasNumberValid('r123455/79/12');
      expect(isValid).toStrictEqual(undefined);
    });

    it('Should allow MU prefix in any case', () => {
      const mu = isAcasNumberValid('MU123456/78/12');
      const Mu = isAcasNumberValid('Mu123456/78/12');
      const mU = isAcasNumberValid('mU123456/78/12');
      const muLower = isAcasNumberValid('mu123456/78/12');
      expect(mu).toStrictEqual(undefined);
      expect(Mu).toStrictEqual(undefined);
      expect(mU).toStrictEqual(undefined);
      expect(muLower).toStrictEqual(undefined);
    });

    it('Should reject RU and RMU prefixes', () => {
      const ru = isAcasNumberValid('RU123456/78/12');
      const rmu = isAcasNumberValid('RMU123456/78/12');
      expect(ru).toStrictEqual('invalidAcasNumber');
      expect(rmu).toStrictEqual('invalidAcasNumber');
    });

    it('Should validate correct RNNNNNN/NN/NN format', () => {
      const isValid = isAcasNumberValid('R123456/78/12');
      expect(isValid).toStrictEqual(undefined);
    });

    it('Should validate correct MUNNNNNN/NN/NN format', () => {
      const isValid = isAcasNumberValid('MU123456/78/12');
      expect(isValid).toStrictEqual(undefined);
    });
  });
  describe('isContent100CharsOrLess()', () => {
    it('should not warn when content is 100 characters or less', () => {
      expect(isContent100CharsOrLess(undefined)).toStrictEqual(undefined);
      expect(isContent100CharsOrLess('')).toStrictEqual(undefined);
      expect(isContent100CharsOrLess('1'.repeat(100))).toStrictEqual(undefined);
    });

    it('should warn when content longer than 100 characters', () => {
      expect(isContent100CharsOrLess('1'.repeat(101))).toStrictEqual('tooLong');
    });
  });
});
