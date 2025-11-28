export default class ObjectUtils {
  /**
   * Checks if the given object is empty. First checks if the object is undefined or null. Then checks if the
   * object has any field or not. If an object doesn't have any field returns true.
   * @param object to be checked.
   */
  public static isEmpty(object: unknown): boolean {
    return !object || Object.keys(object).length === 0;
  }
  /**
   * Checks if the given object is not empty. First checks if the object is not undefined or null. Then checks if the
   * object has any field or not. If an object is not undefined or null and has any field, it returns true.
   * @param object to be checked.
   */
  public static isNotEmpty(object: unknown): boolean {
    return !this.isEmpty(object);
  }
}
