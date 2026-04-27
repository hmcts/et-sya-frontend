import { Response } from 'express';

import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
} from '../../components/form/address-validator';
import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';
import { fillRepresentativeAddressFields } from '../helpers/RespondentHelpers';

const logger = getLogger('RepresentedClaimantAddressDetailsController');

export default class RepresentedClaimantAddressDetailsController {
  private readonly form: Form;
  private readonly addressDetailsContent: FormContent = {
    fields: {
      repAddress1: {
        id: 'repAddress1',
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
      repAddress2: {
        id: 'repAddress2',
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
      repAddressTown: {
        id: 'repAddressTown',
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
      repAddressCountry: {
        id: 'repAddressCountry',
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
      repAddressPostcode: {
        id: 'repAddressPostcode',
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
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTED_CLAIMANT_ENTER_EMAIL);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const representedClaimantAddressTypes = req.session.userCase.representedClaimantAddressTypes;
    const content = getPageContent(req, this.addressDetailsContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REPRESENTED_CLAIMANT_ADDRESS_DETAILS,
      TranslationKeys.ENTER_ADDRESS,
    ]);
    if (representedClaimantAddressTypes !== undefined) {
      fillRepresentativeAddressFields(representedClaimantAddressTypes, req.session.userCase);
    }
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REPRESENTED_CLAIMANT_ADDRESS_DETAILS, {
      ...content,
    });
  };
}
