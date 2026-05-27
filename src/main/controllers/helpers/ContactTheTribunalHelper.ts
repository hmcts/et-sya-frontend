import * as LaunchDarkly from '@launchdarkly/node-server-sdk';

import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import applications, { DOCUMENTS } from '../../definitions/contact-applications';
import { AccordionItem } from '../../definitions/govuk/accordion';
import { AnyRecord } from '../../definitions/util-types';
import ObjectUtils from '../../utils/ObjectUtils';
import StringUtils from '../../utils/StringUtils';

import { createRadioBtnsForHearings } from './FormHelpers';
import { getLanguageParam } from './RouterHelpers';

/**
 * Determines whether the claimant is legally represented by an organisation.
 *
 * This method checks if:
 * - The `claimantRepresentedQuestion` field exists and is set to `YesOrNo.YES`.
 * - And either:
 *   - The claimant's representative organisation policy contains a non-empty `Organisation`
 *     object with a valid `OrganisationID`, **or**
 *   - The claimant representative object includes a non-empty `myHmctsOrganisation`.
 *
 * @param {CaseWithId} userCase - The case data object containing claimant and representative details.
 * @returns {boolean} `true` if the claimant is represented by an organisation, otherwise `false`.
 */
export const isClaimantRepresentedByOrganisation = (userCase: CaseWithId): boolean => {
  return (
    userCase?.claimantRepresentedQuestion !== undefined &&
    userCase.claimantRepresentedQuestion === YesOrNo.YES &&
    ((ObjectUtils.isNotEmpty(userCase?.claimantRepresentativeOrganisationPolicy?.Organisation) &&
      StringUtils.isNotBlank(userCase.claimantRepresentativeOrganisationPolicy.Organisation.OrganisationID)) ||
      (ObjectUtils.isNotEmpty(userCase.claimantRepresentative) &&
        ObjectUtils.isNotEmpty(userCase.claimantRepresentative.myHmctsOrganisation)))
  );
};

/**
 * Determines whether claimant is represented by a non-HMCTS representative.
 *
 * Non-HMCTS representation is when claimant has selected represented flow
 * but is not represented via an HMCTS organisation account.
 */
export const isClaimantRepresentedByNonHmctsRepresentative = (userCase: CaseWithId): boolean => {
  return userCase?.claimantRepresentedQuestion === YesOrNo.YES && !isClaimantRepresentedByOrganisation(userCase);
};

/**
 * Get applications accordion items to display on contact the tribunal page.
 * @param req
 * @param bundlesEnabled
 * @param claimantRepresentedByOrganisation
 */
export const getApplicationsAccordionItems = (
  req: AppRequest,
  bundlesEnabled: LaunchDarkly.LDFlagValue,
  claimantRepresentedByOrganisation: boolean
): AccordionItem[] => {
  const { userCase } = req.session;
  if (!claimantRepresentedByOrganisation) {
    const applicationsToDisplay = getApplicationsToDisplay(bundlesEnabled, userCase);
    return applicationsToDisplay.map(application => getApplicationsAccordionItem(req, application));
  } else {
    return [];
  }
};

const getApplicationsToDisplay = (bundlesEnabled: LaunchDarkly.LDFlagValue, userCase: CaseWithId): string[] => {
  const allowBundlesFlow =
    bundlesEnabled &&
    userCase.hearingCollection?.length &&
    createRadioBtnsForHearings(userCase.hearingCollection)?.length;

  if (!allowBundlesFlow) {
    return applications.filter(app => app !== DOCUMENTS);
  } else {
    return applications;
  }
};

const getApplicationsAccordionItem = (req: AppRequest, application: string): AccordionItem => {
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  const label = translations.sections[application].label;

  const link =
    application === DOCUMENTS
      ? PageUrls.PREPARE_DOCUMENTS + languageParam
      : `/contact-the-tribunal/${application}${languageParam}`;

  const html =
    '<p class="govuk-body">' +
    translations.sections[application].body +
    '</p>' +
    '<p class="govuk-body"><a class="govuk-link" href="' +
    link +
    '">' +
    label +
    '</a></p>';

  return {
    heading: {
      text: label,
    },
    content: {
      html,
    },
  };
};
