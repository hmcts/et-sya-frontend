import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';
import {
  activateRespondentApplicationsLink,
  populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors,
} from './helpers/PageContentHelpers';

export default class RespondentApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const tseGenericApps = userCase?.genericTseApplicationCollection;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    };

    activateRespondentApplicationsLink(tseGenericApps, req);
    populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors(tseGenericApps, req.url, translations);

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPONDENT_APPLICATIONS,
    ]);

    res.render(TranslationKeys.RESPONDENT_APPLICATIONS, {
      ...content,
      tseGenericApps,
      translations,
    });
  };
}
