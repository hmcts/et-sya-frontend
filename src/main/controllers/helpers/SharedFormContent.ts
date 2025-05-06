import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
  isValidUKPostcode,
} from '../../components/form/address_validator';
import { FormContent } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
const POSTCODE_OR_AREA_CODE_REQUIRED = 'Postcode or area code (required)';

export const createRespondentAddressContent = (postcodeLabel: string): FormContent => ({
  fields: {
    respondentAddress1: {
      id: 'address1',
      name: 'address-line1',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.addressLine1,
      labelSize: null,
      attributes: {
        autocomplete: 'address-line1',
        maxLength: 150,
      },
      validator: isValidAddressFirstLine,
    },
    respondentAddress2: {
      id: 'address2',
      name: 'address-line2',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.addressLine2,
      labelSize: null,
      attributes: {
        autocomplete: 'address-line2',
        maxLength: 50,
      },
      validator: isValidAddressSecondLine,
    },
    respondentAddressTown: {
      id: 'addressTown',
      name: 'address-town',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.town,
      labelSize: null,
      attributes: {
        autocomplete: 'address-level2',
        maxLength: 50,
      },
      validator: isValidCountryTownOrCity,
    },
    respondentAddressCountry: {
      id: 'addressCountry',
      name: 'address-country',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.country,
      labelSize: null,
      attributes: {
        maxLength: 50,
      },
      validator: isValidCountryTownOrCity,
    },
    respondentAddressPostcode: {
      id: 'addressPostcode',
      name: 'address-postcode',
      type: 'text',
      classes: 'govuk-label govuk-input--width-10',
      label: postcodeLabel,
      labelSize: null,
      attributes: {
        autocomplete: 'postal-code',
        maxLength: 14,
      },
      validator: postcodeLabel === POSTCODE_OR_AREA_CODE_REQUIRED ? isValidUKPostcode : null,
    },
  },
  submit: submitButton,
  saveForLater: saveForLaterButton,
});
