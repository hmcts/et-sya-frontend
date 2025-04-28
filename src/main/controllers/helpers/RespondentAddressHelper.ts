import { Response } from 'express';

import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
  isValidUKPostcode,
} from '../../components/form/address_validator';
import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';

import { handlePostLogicForRespondent } from './CaseHelpers';
import { assignFormData, getPageContent } from './FormHelpers';
import { fillRespondentAddressFields, getRespondentIndex, getRespondentRedirectUrl } from './RespondentHelpers';

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
 * Handle common GET functions for Non UK address
 * @param userCase userCase
 */
export const fillRespondentAddressFieldsUK = (userCase: CaseWithId): void => {
  if (userCase.respondentAddressTypes !== undefined) {
    fillRespondentAddressFields(userCase.respondentAddressTypes, userCase);
  }
};

/**
 * Handle common GET functions for UK address
 * @param req request
 */
export const fillRespondentAddressFieldsNonUK = (req: AppRequest): void => {
  const { userCase } = req.session;
  const respondentIndex = getRespondentIndex(req);
  const selectedRespondent = userCase.respondents[respondentIndex];
  userCase.respondentEnterPostcode = undefined;
  userCase.respondentAddressTypes = undefined;
  userCase.respondentAddress1 = selectedRespondent?.respondentAddress1;
  userCase.respondentAddress2 = selectedRespondent?.respondentAddress2;
  userCase.respondentAddressTown = selectedRespondent?.respondentAddressTown;
  userCase.respondentAddressCountry = selectedRespondent?.respondentAddressCountry;
  userCase.respondentAddressPostcode = selectedRespondent?.respondentAddressPostcode;
};

/**
 * Handle common GET functions in RespondentAddressController
 * @param req request
 * @param res response
 * @param form form
 * @param formContent formContent
 */
export const handleGet = (req: AppRequest, res: Response, form: Form, formContent: FormContent): void => {
  const { userCase } = req.session;
  const respondentIndex = getRespondentIndex(req);
  const selectedRespondent = userCase.respondents[respondentIndex];
  const content = getPageContent(
    req,
    formContent,
    [TranslationKeys.COMMON, TranslationKeys.RESPONDENT_ADDRESS, TranslationKeys.ENTER_ADDRESS],
    respondentIndex
  );
  assignFormData(userCase, form.getFormFields());
  res.render(TranslationKeys.RESPONDENT_ADDRESS, {
    ...content,
    respondentName: selectedRespondent.respondentName,
    previousPostcode: selectedRespondent.respondentAddressPostcode,
  });
};
