import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import {
  getApplicationsAccordionItems,
  isClaimantRepresentedByNonHmctsRepresentative,
  isClaimantRepresentedByOrganisation,
} from './helpers/ContactTheTribunalHelper';
import { getPageContent } from './helpers/FormHelpers';

/**
 * Controller for contact-the-tribunal page with a list of applications to start
 */
export default class ContactTheTribunalController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const bundlesEnabled = await getFlagValue(FEATURE_FLAGS.BUNDLES, null);
    const claimantRepresentedByOrganisation = isClaimantRepresentedByOrganisation(req.session.userCase);
    const claimantRepresentedByNonHmctsRepresentative = isClaimantRepresentedByNonHmctsRepresentative(
      req.session.userCase
    );

    // Set flag to indicate user has visited the selection page
    // This allows FormSubmissionCheck to verify proper flow
    req.session.visitedContactTribunalSelection = true;

    const applicationsAccordionItems = getApplicationsAccordionItems(
      req,
      bundlesEnabled,
      claimantRepresentedByOrganisation
    );

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_THE_TRIBUNAL,
    ]);
    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL, {
      ...content,
      hideContactUs: true,
      applicationsAccordionItems,
      claimantRepresentedByOrganisation,
      isClaimantRepresentedByNonHmctsRepresentative: claimantRepresentedByNonHmctsRepresentative,
      welshEnabled,
    });
  }
}
