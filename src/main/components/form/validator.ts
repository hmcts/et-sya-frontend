import { ALLOWED_FILE_FORMATS } from '../../definitions/constants';
import { Logger } from '../../logger';

export type Validator = (value: string | string[] | undefined) => void | string;

export const isFieldFilledIn: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return 'required';
  }
};

export const isRespondentNameValid: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return 'required';
  } else if (!/(=?^.{1,100}$)/.test(value as string)) {
    return 'invalidLength';
  }
};

export const isContent2500CharsOrLess: Validator = value => {
  if (value && (value as string).trim().length > 2500) {
    return 'tooLong';
  }
};

export const isContent100CharsOrLess: Validator = value => {
  if (value && (value as string).trim().length > 100) {
    return 'tooLong';
  }
};

export const isContentBetween3And100Chars: Validator = value => {
  if (!value) {
    return 'required';
  }

  const nameLength = (value as string).trim().length;
  if (nameLength < 3 || nameLength > 100) {
    return 'invalidLength';
  }
};

export const isOptionSelected: Validator = value => {
  if (!value || (value as string).trim() === 'notSelected') {
    return 'required';
  }
};

export const atLeastOneFieldIsChecked: Validator = (fields: string[]) => {
  if (!fields || (fields as []).length === 0) {
    return 'required';
  }
};

export const isValidUKTelNumber: Validator = value => {
  if (value === null || value === '') {
    return;
  }
  try {
    if (!/^[+()\- \d]+$/.test(value as string)) {
      return 'nonnumeric';
    }
    if (
      !/^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?#(\d{4}|\d{3}))?$/.test(
        value as string
      )
    ) {
      return 'invalid';
    }
  } catch (e) {
    return 'invalid';
  }
};

export const isJobTitleValid: Validator = value => {
  if (typeof value === 'string') {
    const inputStrLength = (value as string).trim().length;
    if (inputStrLength === 0) {
      return;
    }

    if (inputStrLength === 1 || inputStrLength > 100) {
      return 'invalid-length';
    }
  }
};

export const isValidTwoDigitInteger: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return 'invalid';
  }

  if (!/^\d{1,2}$/.test(value as string)) {
    return 'notANumber';
  }
};

export const isValidNoticeLength: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return;
  }

  if (!/^\d{1,2}$/.test(value as string)) {
    return 'notANumber';
  }
};

export const areBenefitsValid: Validator = value => {
  return isContent2500CharsOrLess(value);
};

export const isPayIntervalNull: Validator = (value: string) => {
  if (!value) {
    return 'required';
  }
};

export const arePayValuesNull: Validator = (value: string[]) => {
  if (value && value.every(element => !element)) {
    return 'required';
  }
};

export const isValidAvgWeeklyHours: Validator = value => {
  const valueAsString: string = value as string;

  if (!value || valueAsString.trim().length === 0) {
    return;
  }

  if (valueAsString.trim().startsWith('0') && valueAsString.length > 1 && valueAsString.charAt(1) !== '.') {
    return 'invalid';
  }

  if (valueAsString.trim().startsWith('.')) {
    return 'invalid';
  }

  if (!/^-?\d{0,3}\.?\d{1,3}$/.test(valueAsString)) {
    return 'notANumber';
  }

  if (valueAsString.trim().startsWith('-')) {
    return 'negativeNumber';
  }

  const maxValue = 168;
  const minValue = 0;
  const hours = parseFloat(value as string);

  if (hours > maxValue) {
    return 'exceeded';
  } else if (hours < minValue) {
    return 'negativeNumber';
  }
};

export const validateTitlePreference: Validator = (value: string) => {
  if (!value) {
    return;
  } else if (value.trim().length < 2) {
    return 'lengthError';
  } else if (/^\d+$/.test(value) || /^\D*\d/.test(value)) {
    return 'numberError';
  }
};

export const hasInvalidName = (fileName: string): string => {
  if (!fileName) {
    return;
  }

  const fileNameRegExPattern = /^(?!\.)[^|*?:<>/$"]{1,150}$/;

  if (fileNameRegExPattern.test(fileName)) {
    return;
  } else {
    return 'invalidFileName';
  }
};

export const hasInvalidFileFormat = (value: Express.Multer.File, logger: Logger): string => {
  if (!value || !value.originalname) {
    return;
  }

  for (const format of ALLOWED_FILE_FORMATS) {
    if (value.originalname.endsWith('.' + format)) {
      return;
    }
  }
  if (logger) {
    logger.info('Invalid file name:' + value.originalname);
  }
  return 'invalidFileFormat';
};

export const isNotPdfFileType = (value: Express.Multer.File): string => {
  if (!value || !value.originalname) {
    return;
  }
  if (value.originalname.toLowerCase().endsWith('.pdf')) {
    return;
  }
  return 'invalidFileFormat';
};

export const isAcasNumberValid: Validator = value => {
  const valueAsString = value as string;
  if (!/^[rR]\d{6}\/\d{2}\/\d{2}$/.test(valueAsString)) {
    return 'invalidAcasNumber';
  }
};
