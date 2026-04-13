import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getUserApplications, getUserCasesByLastModified } from '../services/CaseSelectionService';

import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantApplicationsController');

export default class ClaimantApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.query.src === 'nav-link' || req.query.src === 'side-bar-link') {
      logger.info('Navigate to Claimant applications page accessed via ' + req.query.src);
    }
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_APPLICATIONS,
    ]);
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };
    //reset return url to prevent redirect loop after deleting a draft claim
    req.session.returnUrl = undefined;
    const userCases = await getUserCasesByLastModified(req);
    if (userCases.length === 0) {
      req.session.hasUserCases = false;
      return res.redirect(PageUrls.HOME);
    } else {
      const languageParam = getLanguageParam(req.url);
      const usersApplications = getUserApplications(userCases, translations, languageParam);
      req.session.userCases = userCases;
      req.session.hasUserCases = true;
      res.render(TranslationKeys.CLAIMANT_APPLICATIONS, {
        ...content,
        usersApplications,
        currentUrl: PageUrls.CLAIMANT_APPLICATIONS,
      });
    }
  };
}
