import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn, isInvalidPostcode } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCaseForRespondent } from './helpers';

export default class RespondentAddressController {
  private readonly form: Form;
  private readonly respondentAddressContent: FormContent = {
    fields: {
      respondentAddress1: {
        id: 'address1',
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
      respondentAddress2: {
        id: 'address2',
        name: 'address-line2',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.line2Optional,
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
        },
        validator: isFieldFilledIn,
      },
      respondentAddressCounty: {
        id: 'addressCounty',
        name: 'address-county',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.county,
        labelSize: null,
      },
      respondentAddressPostcode: {
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

  constructor() {
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = req.session.userCase.respondents.length > 1 ? PageUrls.ACAS_CERT_NUM : PageUrls.WORK_ADDRESS;
    setUserCaseForRespondent(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.respondentAddressContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_ADDRESS,
      'enter-address',
    ]);
    const respondents = req.session.userCase.respondents;
    const selectedRespondent = respondents[req.session.userCase.selectedRespondentIndex];
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      respondentName: selectedRespondent.respondentName,
    });
  };
}
