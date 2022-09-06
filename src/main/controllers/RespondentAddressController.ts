import { Response } from 'express';

import { isValidAddressFirstLine, isValidCountryTownOrCity } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import {
  assignFormData,
  getPageContent,
  getRespondentIndex,
  getRespondentRedirectUrl,
  handleSaveAsDraft,
  handleSessionErrors,
  setUserCaseForRespondent,
} from './helpers';

export default class RespondentAddressController {
  private readonly form: Form;
  private readonly respondentAddressContent: FormContent = {
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
          maxLength: 100,
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
        },
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
          maxLength: 60,
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
          maxLength: 60,
        },
        validator: isValidCountryTownOrCity,
      },
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
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCaseForRespondent(req, this.form);
    const { saveForLater } = req.body;
    if (saveForLater) {
      handleSaveAsDraft(res);
    } else {
      const nextPage = req.session.userCase.respondents.length > 1 ? PageUrls.ACAS_CERT_NUM : PageUrls.WORK_ADDRESS;
      const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, nextPage);
      handleSessionErrors(req, res, this.form, redirectUrl);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const respondents = req.session.userCase.respondents;
    const respondentIndex = getRespondentIndex(req);
    const selectedRespondent = respondents[respondentIndex];
    const content = getPageContent(
      req,
      this.respondentAddressContent,
      [TranslationKeys.COMMON, TranslationKeys.RESPONDENT_ADDRESS, TranslationKeys.ENTER_ADDRESS],
      respondentIndex
    );

    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      respondentName: selectedRespondent.respondentName,
    });
  };
}
