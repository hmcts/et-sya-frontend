import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';

import { getPageContent } from './helpers/FormHelpers';
import {
  getRespondentApplications,
  populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors,
} from './helpers/TseRespondentApplicationHelpers';

const logger = getLogger('RespondentApplicationsController');
export default class RespondentApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCase = (req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
      ));

      const respondentApplications = getRespondentApplications(userCase);
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

      const welshEnabled = await getFlagValue('welsh-language', null);

      res.render(TranslationKeys.RESPONDENT_APPLICATIONS, {
        ...content,
        respondentApplications,
        translations,
        welshEnabled,
      });
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
