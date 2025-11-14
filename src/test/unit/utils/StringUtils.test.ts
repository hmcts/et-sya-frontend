import { DefaultValues } from '../../../main/definitions/constants';
import StringUtils from '../../../main/utils/StringUtils';

describe('StringUtils tests', () => {
  const testStringToBeReplaced1 = 'testStringOldValueToBeReplacedOldValueIsHere';
  const testStringToBeReplaced2 = 'OldValueOldValueTestStringToBeReplacedOldValueIsHere';
  const testStringOldValue = 'OldValue';
  const testStringNewValue = 'NEW_TEXT';
  const testStringInvalidOldValue = 'invalidOldValue';
  const testStringReplaced1 = 'testStringNEW_TEXTToBeReplacedOldValueIsHere';
  const testStringRemoved1 = 'testStringToBeReplacedOldValueIsHere';
  const testStringReplaced2 = 'NEW_TEXTOldValueTestStringToBeReplacedOldValueIsHere';
  const testStringRemoved2 = 'OldValueTestStringToBeReplacedOldValueIsHere';
  it.each([
    { value: undefined, result: true },
    { value: '', result: true },
    { value: ' ', result: true },
    { value: 'test', result: false },
    { value: ' test', result: false },
    { value: 'test   ', result: false },
    { value: 'test ', result: false },
    { value: '    test', result: false },
    { value: ' test ', result: false },
    { value: '    test   ', result: false },
    { value: '     ', result: true },
    { value: null, result: true },
  ])('check if given string value is blank: %o', ({ value, result }) => {
    expect(StringUtils.isBlank(value)).toStrictEqual(result);
  });
  it.each([
    { value: undefined, result: false },
    { value: '', result: false },
    { value: ' ', result: false },
    { value: 'test', result: true },
    { value: ' test', result: true },
    { value: 'test   ', result: true },
    { value: 'test ', result: true },
    { value: '    test', result: true },
    { value: ' test ', result: true },
    { value: '    test   ', result: true },
    { value: '     ', result: false },
    { value: null, result: false },
  ])('check if given string value is not blank: %o', ({ value, result }) => {
    expect(StringUtils.isNotBlank(value)).toStrictEqual(result);
  });
  it.each([
    { text: undefined, oldValue: testStringOldValue, newValue: testStringNewValue, result: undefined },
    {
      text: DefaultValues.STRING_EMPTY,
      oldValue: testStringOldValue,
      newValue: testStringNewValue,
      result: DefaultValues.STRING_EMPTY,
    },
    {
      text: DefaultValues.STRING_SPACE,
      oldValue: testStringOldValue,
      newValue: testStringNewValue,
      result: DefaultValues.STRING_SPACE,
    },
    {
      text: testStringToBeReplaced1,
      oldValue: undefined,
      newValue: testStringNewValue,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      oldValue: DefaultValues.STRING_EMPTY,
      newValue: testStringNewValue,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      oldValue: DefaultValues.STRING_SPACE,
      newValue: testStringNewValue,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      oldValue: testStringInvalidOldValue,
      newValue: testStringNewValue,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      oldValue: testStringOldValue,
      newValue: undefined,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      oldValue: testStringOldValue,
      newValue: DefaultValues.STRING_EMPTY,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      oldValue: testStringOldValue,
      newValue: DefaultValues.STRING_SPACE,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      oldValue: testStringOldValue,
      newValue: testStringNewValue,
      result: testStringReplaced1,
    },
    {
      text: testStringToBeReplaced2,
      oldValue: testStringOldValue,
      newValue: testStringNewValue,
      result: testStringReplaced2,
    },
  ])(
    'check if the first instance of old value in the text is replaced with new value: %o',
    ({ text, oldValue, newValue, result }) => {
      expect(StringUtils.replaceFirstOccurrence(text, oldValue, newValue)).toStrictEqual(result);
    }
  );
  it.each([
    { text: undefined, valueToRemove: testStringOldValue, result: undefined },
    {
      text: DefaultValues.STRING_EMPTY,
      valueToRemove: testStringOldValue,
      result: DefaultValues.STRING_EMPTY,
    },
    {
      text: testStringToBeReplaced1,
      valueToRemove: undefined,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      valueToRemove: DefaultValues.STRING_EMPTY,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      valueToRemove: DefaultValues.STRING_SPACE,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      valueToRemove: testStringInvalidOldValue,
      result: testStringToBeReplaced1,
    },
    {
      text: testStringToBeReplaced1,
      valueToRemove: testStringOldValue,
      result: testStringRemoved1,
    },
    {
      text: testStringToBeReplaced2,
      valueToRemove: testStringOldValue,
      result: testStringRemoved2,
    },
  ])('check if the first occurrence of valueToRemove in the text is removed: %o', ({ text, valueToRemove, result }) => {
    expect(StringUtils.removeFirstOccurrence(text, valueToRemove)).toStrictEqual(result);
  });
});
