import CollectionUtils from '../../../main/utils/CollectionUtils';

describe('CollectionUtils tests', () => {
  it.each([
    { value: undefined, result: true },
    { value: [''], result: false },
    { value: [], result: true },
    { value: null, result: true },
  ])('check if given collection value is blank: %o', ({ value, result }) => {
    expect(CollectionUtils.isEmpty<string>(value)).toStrictEqual(result);
  });
  it.each([
    { value: undefined, result: false },
    { value: [''], result: true },
    { value: [], result: false },
    { value: null, result: false },
  ])('check if given collection value is blank: %o', ({ value, result }) => {
    expect(CollectionUtils.isNotEmpty<string>(value)).toStrictEqual(result);
  });
  it.each([
    { collection: [], index: 1, result: [] },
    { collection: undefined, index: 0, result: undefined },
    { collection: null, index: 0, result: null },
    {
      collection: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
      index: undefined,
      result: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
    },
    {
      collection: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
      index: null,
      result: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
    },
    {
      collection: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
      index: -1,
      result: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
    },
    {
      collection: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
      index: 1,
      result: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 2', name: 'testName 2' },
      ],
    },
    {
      collection: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
      index: 0,
      result: [
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
    },
    {
      collection: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
      index: 2,
      result: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
      ],
    },
    {
      collection: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
      index: 4,
      result: [
        { id: 'testId 0', name: 'testName 0' },
        { id: 'testId 1', name: 'testName 1' },
        { id: 'testId 2', name: 'testName 2' },
      ],
    },
  ])('check if given item is removed from collection: %o', ({ collection, index, result }) => {
    CollectionUtils.removeItemFromCollectionByIndex(collection, index);
    expect(collection).toStrictEqual(result);
  });
});
