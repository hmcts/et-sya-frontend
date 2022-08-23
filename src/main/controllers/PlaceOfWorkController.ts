import { Response } from 'express';

import { isValidAddressFirstLine, isValidCountry, isValidTownOrCity } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import {
  assignFormData,
  getPageContent,
  getRespondentRedirectUrl,
  handleSessionErrors,
  setUserCaseForRespondent,
} from './helpers';

export default class PlaceOfWorkController {
  private readonly form: Form;
  private readonly placeOfWorkContent: FormContent = {
    fields: {
      workAddress1: {
        id: 'address1',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.addressLine1,
        labelSize: null,
        attributes: {
          autocomplete: 'address-line1',
          maxLength: 100,
        },
        validator: isValidAddressFirstLine,
      },
      workAddress2: {
        id: 'address2',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.addressLine2,
        labelSize: null,
        attributes: {
          autocomplete: 'address-line2',
        },
      },
      workAddressTown: {
        id: 'addressTown',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.town,
        labelSize: null,
        attributes: {
          autocomplete: 'address-level2',
          maxLength: 60,
        },
        validator: isValidTownOrCity,
      },
      workAddressCountry: {
        id: 'addressCountry',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.country,
        labelSize: null,
        attributes: {
          maxLength: 60,
        },
        validator: isValidCountry,
      },
      workAddressPostcode: {
        id: 'addressPostcode',
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
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.placeOfWorkContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.ACAS_CERT_NUM);
    setUserCaseForRespondent(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.placeOfWorkContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ENTER_ADDRESS,
      TranslationKeys.PLACE_OF_WORK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PLACE_OF_WORK, {
      ...content,
    });
  };
}
