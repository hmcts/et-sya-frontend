import { isFieldFilledIn, isInvalidPostcode } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const workAddressContent: FormContent = {
  fields: {
    address1: {
      id: 'address-line1',
      name: 'address-line1',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.buildingStreet,
      labelSize: null,
      validator: isFieldFilledIn,
      attributes: {
        autocomplete: 'address-line1',
      },
    },
    address2: {
      id: 'address-line2',
      name: 'address-line2',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.line2Optional,
      labelSize: null,
      attributes: {
        autocomplete: 'address-line2',
      },
    },
    addressTown: {
      id: 'address-town',
      name: 'address-town',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.town,
      labelSize: null,
      attributes: {
        autocomplete: 'address-level2',
      },
      validator: isFieldFilledIn,
    },
    addressCounty: {
      id: 'address-county',
      name: 'address-county',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.county,
      labelSize: null,
    },
    addressPostcode: {
      id: 'address-postcode',
      name: 'address-postcode',
      type: 'text',
      classes: 'govuk-label govuk-input--width-10',
      label: l => l.postcode,
      labelSize: null,
      attributes: {
        maxLength: 14,
        autocomplete: 'postal-code',
      },
      validator: isInvalidPostcode,
    },
  },
  submit: {
    text: (l: AnyRecord): string => l.submit,
    classes: 'govuk-!-margin-right-2',
  },
  saveForLater: {
    text: (l: AnyRecord): string => l.saveForLater,
    classes: 'govuk-button--secondary',
  },
};
