import { DefaultValues } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class NumberUtils {
  public static isEmptyOrZero(value: number): boolean {
    return !value || value === 0;
  }
  public static isNotEmpty(value: number): boolean {
    return value !== undefined && value !== null;
  }
  public static isEmpty(value: number): boolean {
    return !this.isNotEmpty(value);
  }
  public static isNotEmptyOrZero(value: number): boolean {
    return !this.isEmptyOrZero(value);
  }
  public static formatAcasNumberDashToUnderscore(acasNumber: string): string {
    return StringUtils.isBlank(acasNumber)
      ? DefaultValues.STRING_EMPTY
      : acasNumber.trim().replace(DefaultValues.STRING_SLASH_REGEX, DefaultValues.STRING_UNDERSCORE);
  }
  public static formatAcasNumberDashToEmptyString(acasNumber: string): string {
    return StringUtils.isBlank(acasNumber)
      ? DefaultValues.STRING_EMPTY
      : acasNumber.trim().replace(DefaultValues.STRING_SLASH_REGEX, DefaultValues.STRING_EMPTY);
  }
  public static isNumericValue(stringValue: string): boolean {
    return !(!stringValue || Number.isNaN(Number(stringValue)) || !Number(stringValue));
  }
  public static isNonNumericValue(stringValue: string): boolean {
    return !this.isNumericValue(stringValue);
  }

  /**
   * Returns a 16-digit case id or undefined.
   * Prefer this over Number() when embedding ids in redirect URLs / Location headers.
   * Accepts string or number because CCD/API responses may deserialize ids as numbers.
   *
   * CCD case ids are 16 digits, and claimants may enter them hyphenated as
   * 1111-2222-3333-4444. Hyphens are stripped; the value is not padded.
   */
  public static getSafeCaseIdDigits(stringValue?: string | number | null): string | undefined {
    if (stringValue === undefined || stringValue === null || stringValue === '') {
      return undefined;
    }
    const trimmed = String(stringValue).trim();
    const hyphenatedMatch = /^(\d{4})-(\d{4})-(\d{4})-(\d{4})$/.exec(trimmed);
    if (hyphenatedMatch) {
      return `${hyphenatedMatch[1]}${hyphenatedMatch[2]}${hyphenatedMatch[3]}${hyphenatedMatch[4]}`;
    }
    const match = /^(\d{16})$/.exec(trimmed);
    return match?.[1];
  }

  /**
   * Converts string value to number. If string value is not a numeric value returns undefined.
   * @param stringValue value that will be converted to number type
   * @return numeric correspondence of the given string value
   */
  public static convertStringToNumber(stringValue: string): number {
    if (this.isNonNumericValue(stringValue)) {
      return undefined;
    }
    return Number(stringValue);
  }
}
