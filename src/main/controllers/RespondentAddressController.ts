import { Response } from 'express';

import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
} from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentIndex, getRespondentRedirectUrl } from './helpers/RespondentHelpers';

const logger = getLogger('RespondentAddressController');

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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        label: l => l.postcode,
        labelSize: null,
        hidden: true,
        attributes: {
          autocomplete: 'postal-code',
          maxLength: 14,
        },
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
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const { userCase } = req.session;
    const nextPage =
      userCase.respondents.length > 1 || userCase.pastEmployer === YesOrNo.NO
        ? PageUrls.ACAS_CERT_NUM
        : PageUrls.WORK_ADDRESS;
    const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, nextPage);
    handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
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
      previousPostcode: selectedRespondent.respondentAddressPostcode,
    });
  };
}
