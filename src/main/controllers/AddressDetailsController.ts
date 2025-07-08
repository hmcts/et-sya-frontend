import { Response } from 'express';

import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
} from '../components/form/address-validator';
import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { fillAddressAddressFields } from './helpers/RespondentHelpers';

const logger = getLogger('AddressDetailsController');

export default class AddressDetailsController {
  private readonly form: Form;
  private readonly addressDetailsContent: FormContent = {
    fields: {
      address1: {
        id: 'address1',
        name: 'address-line1',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.addressLine1,
        labelSize: null,
        validator: isValidAddressFirstLine,
        attributes: {
          autocomplete: 'address-line1',
          maxLength: 150,
        },
      },
      address2: {
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
      addressTown: {
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
      addressCountry: {
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
      addressPostcode: {
        id: 'addressPostcode',
        name: 'address-postcode',
        type: 'text',
        classes: 'govuk-label govuk-input--width-10',
        label: l => l.postcode,
        labelSize: null,
        attributes: {
          maxLength: 14,
          autocomplete: 'postal-code',
        },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.addressDetailsContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.TELEPHONE_NUMBER);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const addressAddressTypes = req.session.userCase.addressAddressTypes;
    const content = getPageContent(req, this.addressDetailsContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ADDRESS_DETAILS,
      TranslationKeys.ENTER_ADDRESS,
    ]);
    if (addressAddressTypes !== undefined) {
      fillAddressAddressFields(addressAddressTypes, req.session.userCase);
    }
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ADDRESS_DETAILS, {
      ...content,
    });
  };
}
