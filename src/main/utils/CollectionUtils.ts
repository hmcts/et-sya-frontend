import NumberUtils from './NumberUtils';

export default class CollectionUtils {
  public static isEmpty<T>(value: T[]): boolean {
    return !value || value.length === 0;
  }
  public static isNotEmpty<T>(value: T[]): boolean {
    return !this.isEmpty<T>(value);
  }
  public static removeItemFromCollectionByIndex<T>(collection: T[], index: number): void {
    if (this.isEmpty(collection) || NumberUtils.isEmpty(index) || index < 0) {
      return;
    }
    collection.splice(index, 1);
  }
}
