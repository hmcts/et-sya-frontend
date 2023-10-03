import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import applications from '../definitions/contact-applications';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getPageContent } from './helpers/FormHelpers';

/**
 * Controller for contact-the-tribunal page with a list of applications to start
 */
export default class ContactTheTribunalController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    };

    const applicationsAccordionItems = applications.map(application => {
      const label = translations.sections[application].label;
      return {
        heading: {
          text: label,
        },
        content: {
          html:
            "<p class='govuk-body'>" +
            translations.sections[application].body +
            '</p> <br>' +
            "<a class='govuk-link govuk-body' href='/contact-the-tribunal/" +
            application +
            "'>" +
            label +
            '</a>',
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
      welshEnabled,
    });
  }
}
