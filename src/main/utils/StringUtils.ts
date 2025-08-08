import { DefaultValues } from '../definitions/constants';

export default class StringUtils {
  /**
   * Checks if the given string value is blank. It first checks if value is undefined or null then checks value has
   * length equal to 0 when trimmed. If not has any value or the length of the value is equal to zero after trimmed
   * returns true. For example '', undefined, null, '   ' values will return true.
   * @param value to be checked if blank or not.
   */
  public static isBlank(value: string): boolean {
    return !value || String(value).trim().length === 0;
  }
  /**
   * Checks if the given string value is not blank. It first checks if value is not undefined or null.
   * Then checks value has length greater than 0 when trimmed. If checked value's length is
   * bigger than zero after trimmed returns true. For example '', undefined, null, '   ' values will return false.
   * @param value to be checked if blank or not.
   */
  public static isNotBlank(value: string): boolean {
    return !this.isBlank(value);
  }
  /**
   * Checks if the given string value has length more than the given maxLength.
   * @param value to be checked if blank or not.
   * @param maxLength is the maximum length to be checked.
   */
  public static isLengthMoreThan(value: string, maxLength: number): boolean {
    return value && value.length > maxLength;
  }

  /**
   * Replaces the first occurrence of the old value in the text with the new value.
   * @param text to be searched for the old value.
   * @param oldValue is the value to be searched in the text.
   * @param newValue is the value to be replaced with the first occurrence of the old value.
   */
  public static replaceFirstOccurrence(text: string, oldValue: string, newValue: string): string {
    if (this.isBlank(text) || this.isBlank(oldValue) || this.isBlank(newValue) || text.indexOf(oldValue) === -1) {
      return text;
    }
    return text.replace(new RegExp(`(${oldValue})|(${oldValue})`), newValue);
  }
  /**
   * Removes the first occurrence of the value from the given text.
   * @param text to be searched for the value to be removed
   * @param valueToRemove value to be removed from the text
   */
  public static removeFirstOccurrence(text: string, valueToRemove: string): string {
    if (this.isBlank(text) || this.isBlank(valueToRemove) || text.indexOf(valueToRemove) === -1) {
      return text;
    }
    const e = new RegExp(`(${valueToRemove})|(${valueToRemove})`);
    return text.replace(e, DefaultValues.STRING_EMPTY);
  }
}
