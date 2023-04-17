import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';
import {
  activateRespondentApplicationsLink,
  getRespondentApplications,
  populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors,
} from './helpers/TseRespondentApplicationHelpers';

export default class RespondentApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const respondentApplications = getRespondentApplications(userCase);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    };

    activateRespondentApplicationsLink(respondentApplications, userCase);
    populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors(respondentApplications, req.url, translations);

    const content = getPageContent(req, <FormContent>{}, [
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
