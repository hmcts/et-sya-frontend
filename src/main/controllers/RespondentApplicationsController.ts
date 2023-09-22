import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { retrieveCurrentLocale } from './helpers/ApplicationTableRecordTranslationHelper';
import { getPageContent } from './helpers/FormHelpers';
import {
  getRespondentApplications,
  populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors,
} from './helpers/TseRespondentApplicationHelpers';

export default class RespondentApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const respondentApplications = getRespondentApplications(userCase);

    if (respondentApplications?.length > 1) {
      for (const app of respondentApplications) {
        const translatedDate = new Date(app.value?.date).toLocaleDateString(retrieveCurrentLocale(req.url), {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        app.value.date = translatedDate;
      }
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPONDENT_APPLICATIONS, { returnObjects: true }),
    };

    populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors(respondentApplications, req.url, translations);

    const content = getPageContent(req, {} as FormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPONDENT_APPLICATIONS,
    ]);

    res.render(TranslationKeys.RESPONDENT_APPLICATIONS, {
      ...content,
      respondentApplications,
      translations,
    });
  };
}
