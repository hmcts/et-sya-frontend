import { Response } from 'express';

import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
  isValidUKPostcode,
} from '../../components/form/address-validator';
import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, Respondent, YesOrNo } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';

import { handlePostLogicForRespondent } from './CaseHelpers';
import { getRespondentRedirectUrl } from './RespondentHelpers';

const logger = getLogger('RespondentAddressHelper');

/**
 * Get form contact for RespondentAddressController
 * @param isRequired is the postcode field required
 */
export const getRespondentAddressContent = (isRequired: boolean): FormContent => ({
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
      label: l => (isRequired ? l.postcodeRequired : l.postcode),
      labelSize: null,
      attributes: {
        autocomplete: 'postal-code',
        maxLength: 14,
      },
      validator: isRequired ? isValidUKPostcode : null,
    },
  },
  submit: submitButton,
  saveForLater: saveForLaterButton,
});

/**
 * Handle common POST functions in RespondentAddressController
 * @param req request
 * @param res response
 * @param form form
 */
export const handlePost = async (req: AppRequest, res: Response, form: Form): Promise<void> => {
  const { userCase } = req.session;
  const nextPage =
    userCase.respondents.length > 1 || userCase.pastEmployer === YesOrNo.NO
      ? PageUrls.ACAS_CERT_NUM
      : PageUrls.WORK_ADDRESS;
  const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, nextPage);
  await handlePostLogicForRespondent(req, res, form, logger, redirectUrl);
};

/**
 * Clear AddressTypes and fill address for non UK address
 * @param userCase userCase
 * @param selectedRespondent selected respondent
 */
export const fillRespondentAddressFieldsNonUK = (userCase: CaseWithId, selectedRespondent: Respondent): void => {
  userCase.respondentEnterPostcode = undefined;
  userCase.respondentAddressTypes = undefined;
  userCase.respondentAddress1 = selectedRespondent?.respondentAddress1;
  userCase.respondentAddress2 = selectedRespondent?.respondentAddress2;
  userCase.respondentAddressTown = selectedRespondent?.respondentAddressTown;
  userCase.respondentAddressCountry = selectedRespondent?.respondentAddressCountry;
  userCase.respondentAddressPostcode = selectedRespondent?.respondentAddressPostcode;
};
