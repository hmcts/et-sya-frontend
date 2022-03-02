import { isFieldFilledIn, isInvalidPostcode } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const placeOfWorkContent: FormContent = {
  fields: {
    workAddress1: {
      id: 'address1',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.buildingStreet,
      labelSize: null,
      validator: isFieldFilledIn,
    },
    workAddress2: {
      id: 'address2',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: null,
      labelSize: null,
      labelHidden: true,
    },
    workAddressTown: {
      id: 'addressTown',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.town,
      labelSize: null,
      validator: isFieldFilledIn,
    },
    workAddressCounty: {
      id: 'addressCounty',
      type: 'text',
      classes: 'govuk-label govuk-!-width-one-half',
      label: l => l.county,
      labelSize: null,
    },
    workAddressPostcode: {
      id: 'addressPostcode',
      type: 'text',
      classes: 'govuk-label govuk-input--width-10',
      label: l => l.postcode,
      labelSize: null,
      attributes: {
        maxLength: 14,
      },
      validator: isInvalidPostcode,
    },
  },
  submit: {
    text: (l: AnyRecord): string => l.submit,
    classes: 'govuk-!-margin-right-2 hidden',
  },
  saveForLater: {
    text: (l: AnyRecord): string => l.saveForLater,
    classes: 'govuk-button--secondary hidden',
  },
};
