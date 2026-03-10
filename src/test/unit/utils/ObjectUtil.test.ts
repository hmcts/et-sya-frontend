import ObjectUtils from '../../../main/utils/ObjectUtils';

describe('ObjectUtils tests', () => {
  it.each([
    { value: undefined, result: true },
    { value: null, result: true },
    { value: '', result: true },
    { value: 1, result: true },
    { value: {}, result: true },
    { value: { test: 'testValue' }, result: false },
  ])('check if given object is empty', ({ value, result }) => {
    expect(ObjectUtils.isEmpty(value)).toStrictEqual(result);
  });

  it.each([
    { value: undefined, result: false },
    { value: null, result: false },
    { value: '', result: false },
    { value: 1, result: false },
    { value: {}, result: false },
    { value: { test: 'testValue' }, result: true },
  ])('check if given object is not empty', ({ value, result }) => {
    expect(ObjectUtils.isNotEmpty(value)).toStrictEqual(result);
  });
});
