import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { applications } from '../definitions/contact-application';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';

export default class ContactTheTribunalController {
  public get(req: AppRequest, res: Response): void {
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
    });
  }
}
