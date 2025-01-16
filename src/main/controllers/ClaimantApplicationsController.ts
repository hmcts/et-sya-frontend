import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getUserApplications, getUserCasesByLastModified } from '../services/CaseSelectionService';

import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('CaseSelectionService');

export default class ClaimantApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_APPLICATIONS,
    ]);
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };
    const userCases = await getUserCasesByLastModified(req);
    if (userCases.length === 0) {
      logger.info('ClaimantApplicationsController: No cases found for user');
      return res.redirect(PageUrls.HOME);
    } else {
      const languageParam = getLanguageParam(req.url);
      const usersApplications = getUserApplications(userCases, translations, languageParam);
      res.render(TranslationKeys.CLAIMANT_APPLICATIONS, {
        ...content,
        usersApplications,
        currentUrl: PageUrls.CLAIMANT_APPLICATIONS,
      });
    }
  };
}
