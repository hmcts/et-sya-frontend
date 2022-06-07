import { getPartialPayInfoError } from '../../../main/controllers/helpers';
import { PayInterval } from '../../../main/definitions/case';

describe('Helper', () => {
  it('should return error if pay interval does not exist', () => {
    const formData = { payBeforeTax: 123, payAfterTax: 123 };
    const expectedErrors = [{ errorType: 'required', propertyName: 'payInterval' }];
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return error if pay before and after tax does not exist', () => {
    const formData = { payInterval: PayInterval.WEEKLY };
    const expectedErrors = [
      { errorType: 'required', propertyName: 'payBeforeTax' },
      { errorType: 'required', propertyName: 'payAfterTax' },
    ];
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return no errors when both pay interval and pay before tax exist', () => {
    const formData = { payBeforeTax: 123, payInterval: PayInterval.WEEKLY };
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(undefined);
  });

  it('should return no errors when both pay interval and pay after tax exist', () => {
    const formData = { payAfterTax: 123, payInterval: PayInterval.WEEKLY };
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(undefined);
  });
});
