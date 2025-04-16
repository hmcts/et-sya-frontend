import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';

import {
  address1,
  address2,
  addressCountry,
  addressTown,
  handleGet,
  handlePost,
} from './helpers/RespondentAddressHelper';

export default class RespondentAddressNonUkController {
  private readonly form: Form;
  private readonly respondentAddressContent: FormContent = {
    fields: {
      respondentAddress1: address1,
      respondentAddress2: address2,
      respondentAddressTown: addressTown,
      respondentAddressCountry: addressCountry,
      respondentAddressPostcode: {
        id: 'addressPostcode',
        name: 'address-postcode',
        type: 'text',
        classes: 'govuk-label govuk-input--width-10',
        label: l => l.postcode,
        labelSize: null,
        attributes: {
          autocomplete: 'postal-code',
          maxLength: 14,
        },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePost(req, res, this.form);
  };

  public get = (req: AppRequest, res: Response): void => {
    handleGet(req, res, this.form, this.respondentAddressContent);
  };
}
