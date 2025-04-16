import { Response } from 'express';

import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
} from '../../components/form/address_validator';
import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormField } from '../../definitions/form';
import { getLogger } from '../../logger';

import { handlePostLogicForRespondent } from './CaseHelpers';
import { assignFormData, getPageContent } from './FormHelpers';
import { fillRespondentAddressFields, getRespondentIndex, getRespondentRedirectUrl } from './RespondentHelpers';

const logger = getLogger('RespondentAddressHelper');

export const address1: FormField = {
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
};

export const address2: FormField = {
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
};

export const addressTown: FormField = {
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
};

export const addressCountry: FormField = {
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
};

export const handlePost = async (req: AppRequest, res: Response, form: Form): Promise<void> => {
  const { userCase } = req.session;
  const nextPage =
    userCase.respondents.length > 1 || userCase.pastEmployer === YesOrNo.NO
      ? PageUrls.ACAS_CERT_NUM
      : PageUrls.WORK_ADDRESS;
  const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, nextPage);
  await handlePostLogicForRespondent(req, res, form, logger, redirectUrl);
};

export const handleGet = (req: AppRequest, res: Response, form: Form, respondentAddressContent: FormContent): void => {
  const respondents = req.session.userCase.respondents;
  const respondentIndex = getRespondentIndex(req);
  const selectedRespondent = respondents[respondentIndex];
  const content = getPageContent(
    req,
    respondentAddressContent,
    [TranslationKeys.COMMON, TranslationKeys.RESPONDENT_ADDRESS, TranslationKeys.ENTER_ADDRESS],
    respondentIndex
  );
  const respondentAddressTypes = req.session.userCase.respondentAddressTypes;
  if (respondentAddressTypes !== undefined) {
    fillRespondentAddressFields(respondentAddressTypes, req.session.userCase);
  }
  assignFormData(req.session.userCase, form.getFormFields());
  res.render(TranslationKeys.RESPONDENT_ADDRESS, {
    ...content,
    respondentName: selectedRespondent.respondentName,
    previousPostcode: selectedRespondent.respondentAddressPostcode,
  });
};
