import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import applications from '../definitions/contact-applications';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

/**
 * Controller for contact-the-tribunal page with a list of applications to start
 */
export default class ContactTheTribunalController {
  public get(req: AppRequest, res: Response): void {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    };
    const languageParam = getLanguageParam(req.url);
    const showAllSectionsText = translations.showAllSections;
    const hideAllSectionsText = translations.hideAllSections;
    const showSectionText = translations.showSection;
    const hideSectionText = translations.hideSection;
    const applicationsAccordionItems = applications.map(application => {
      const label = translations.sections[application].label;
      return {
        heading: {
          text: label,
        },
        content: {
          bodyText: translations.sections[application].body,
          link: {
            href: `/contact-the-tribunal/${application}${languageParam}`,
            text: label,
          },
        },
      };
    });

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_THE_TRIBUNAL,
    ]);
    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL, {
      ...content,
      hideContactUs: true,
      applicationsAccordionItems,
      showAllSectionsText,
      hideAllSectionsText,
      showSectionText,
      hideSectionText,
    });
  }
}
