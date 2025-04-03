import { Response } from 'express';

import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
  isValidUKPostcode,
} from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { fillRespondentAddressFields, getRespondentIndex, getRespondentRedirectUrl } from './helpers/RespondentHelpers';

const logger = getLogger('RespondentAddressManualController');

export default class RespondentAddressManualController {
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
        label: l => l.postcodeRequired,
        labelSize: null,
        attributes: {
          autocomplete: 'postal-code',
          maxLength: 14,
        },
        validator: isValidUKPostcode,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;
    const nextPage =
      userCase.respondents.length > 1 || userCase.pastEmployer === YesOrNo.NO
        ? PageUrls.ACAS_CERT_NUM
        : PageUrls.WORK_ADDRESS;
    const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, nextPage);
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const respondents = req.session.userCase.respondents;
    const x = req.session.userCase.respondentAddressTypes;
    const respondentIndex = getRespondentIndex(req);
    const selectedRespondent = respondents[respondentIndex];
    const content = getPageContent(
      req,
      this.respondentAddressContent,
      [TranslationKeys.COMMON, TranslationKeys.RESPONDENT_ADDRESS_MANUAL, TranslationKeys.ENTER_ADDRESS],
      respondentIndex
    );
    if (x !== undefined) {
      fillRespondentAddressFields(x, req.session.userCase);
    }
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS_MANUAL, {
      ...content,
      respondentName: selectedRespondent.respondentName,
      previousPostcode: selectedRespondent.respondentAddressPostcode,
    });
  };
}
