import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS, PageUrls, TranslationKeys } from '../definitions/constants';
import applications from '../definitions/contact-applications';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { createRadioBtnsForHearings, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

/**
 * Controller for contact-the-tribunal page with a list of applications to start
 */
export default class ContactTheTribunalController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const bundlesEnabled = await getFlagValue(FEATURE_FLAGS.BUNDLES, null);
    const DOCUMENTS = 'documents';
    const { hearingCollection } = req.session.userCase;
    const claimantRepresented = req.session.userCase.claimantRepresentative;
    const representedOrg = 'ABC Organisation'; // Placeholder for represented organisation, replace with actual logic if needed

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    };

    const languageParam = getLanguageParam(req.url);
    let applicationsToDisplay;
    let applicationsAccordionItems;

    // if bundles not enabled or no hearings in future then remove documents from displayed application types
    const allowBundlesFlow =
      bundlesEnabled && hearingCollection?.length && createRadioBtnsForHearings(hearingCollection)?.length;

    if (!claimantRepresented) {
      if (!allowBundlesFlow) {
        applicationsToDisplay = applications.filter(app => app !== DOCUMENTS);
      } else {
        applicationsToDisplay = applications;
      }

      applicationsAccordionItems = applicationsToDisplay.map(application => {
        const label = translations.sections[application].label;
        const link =
          application === DOCUMENTS
            ? PageUrls.PREPARE_DOCUMENTS + languageParam
            : `/contact-the-tribunal/${application}${languageParam}`;
        return {
          heading: {
            text: label,
          },
          content: {
            bodyText: translations.sections[application].body,
            link: {
              href: link,
              text: label,
            },
          },
        };
      });
    }

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_THE_TRIBUNAL,
    ]);
    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL, {
      ...content,
      hideContactUs: true,
      applicationsAccordionItems,
      claimantRepresented,
      representedOrg,
      welshEnabled,
    });
  }
}
