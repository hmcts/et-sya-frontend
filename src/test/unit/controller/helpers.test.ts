import { getNewJobPartialPayInfoError, getPartialPayInfoError } from '../../../main/controllers/helpers';
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

  it('should return error if new job pay interval does not exist', () => {
    const formData = { newJobPay: 123 };
    const expectedErrors = [{ errorType: 'required', propertyName: 'newJobPayInterval' }];
    const errors = getNewJobPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return error if new job pay does not exist', () => {
    const formData = { newJobPayInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ errorType: 'required', propertyName: 'newJobPay' }];
    const errors = getNewJobPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return no errors when both new job pay interval and new job pay exist', () => {
    const formData = { newJobPay: 123, newJobPayInterval: PayInterval.WEEKLY };
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(undefined);
  });
});
