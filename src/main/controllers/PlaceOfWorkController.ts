import { Response } from 'express';

import { Form } from '../components/form/form';
import { isInvalidPostcode, isWorkAddressLineOneValid, isWorkAddressTownValid } from '../components/form/validator';
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
        validator: isWorkAddressLineOneValid,
      },
      workAddress2: {
        id: 'address2',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.addressLine2,
        labelSize: null,
      },
      workAddressTown: {
        id: 'addressTown',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.town,
        labelSize: null,
        validator: isWorkAddressTownValid,
      },
      workAddressCountry: {
        id: 'addressCountry',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.country,
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
