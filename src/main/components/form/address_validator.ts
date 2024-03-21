import { ValidationErrors } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

import { isFieldFilledIn } from './validator';

export type AddressValidator = (value: string | string[] | undefined, formData: AnyRecord) => void | string;

export const isValidAddressFirstLine: AddressValidator = value => {
  if (isFieldFilledIn(value) === ValidationErrors.REQUIRED) {
    return ValidationErrors.REQUIRED;
  }
  if (!(value as string).match(/(^.{1,150}$)/)) {
    return ValidationErrors.INVALID_VALUE;
  }
};

export const isValidAddressSecondLine: AddressValidator = value => {
  if (!value || (value as string).trim().length === 0) {
    return;
  }
  if (!(value as string).match(/(^.{1,50}$)/)) {
    return ValidationErrors.INVALID_VALUE;
  }
};

export const isValidCountryTownOrCity: AddressValidator = value => {
  if (isFieldFilledIn(value) === ValidationErrors.REQUIRED) {
    return ValidationErrors.REQUIRED;
  }
  if (!(value as string).match(/(^.{1,50}$)/)) {
    return ValidationErrors.INVALID_VALUE;
  }
};

export const isValidUKPostcode: AddressValidator = value => {
  const fieldNotFilledIn = isFieldFilledIn(value);
  if (fieldNotFilledIn) {
    return fieldNotFilledIn;
  }

  if (!(value as string).match(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i)) {
    return ValidationErrors.INVALID_VALUE;
  }
};
