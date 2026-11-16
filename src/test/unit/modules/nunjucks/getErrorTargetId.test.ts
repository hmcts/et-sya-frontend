import { FormField } from '../../../../main/definitions/form';
import { getErrorTargetId } from '../../../../main/modules/nunjucks';

describe('getErrorTargetId', () => {
  it('should target the first checkbox id when checkbox items have their own ids', () => {
    const field = {
      id: 'claimTypePay',
      type: 'checkboxes',
      values: [
        { id: 'arrears', value: 'arrears' },
        { id: 'holidayPay', value: 'holidayPay' },
      ],
    } as FormField;
    expect(getErrorTargetId(field)).toEqual('arrears');
  });

  it('should target the first radio id and skip dividers', () => {
    const field = {
      id: 'hearingPreferences',
      type: 'radios',
      values: [{ divider: true }, { id: 'video', value: 'Video' }],
    } as FormField;
    expect(getErrorTargetId(field)).toEqual('video');
  });

  it('should fall back to the field id when the first item has no id', () => {
    const field = {
      id: 'claimantSex',
      type: 'radios',
      values: [{ value: 'Male' }, { value: 'Female' }],
    } as FormField;
    expect(getErrorTargetId(field)).toEqual('claimantSex');
  });

  it('should use the field id for non-option fields', () => {
    const field = { id: 'firstName', type: 'text' } as FormField;
    expect(getErrorTargetId(field)).toEqual('firstName');
  });
});
