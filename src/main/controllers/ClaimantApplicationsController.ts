import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { getUserApplications, getUserCases } from '../services/CaseSelectionService';

import { getPageContent } from './helpers';

export default class ClaimantApplicationsController {
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_APPLICATIONS,
    ]);

    const userCases = getUserCases(req);

    if (userCases.length === 0) {
      res.redirect(PageUrls.HOME);
    } else {
      const usersApplications = getUserApplications(userCases);

      res.render(TranslationKeys.CLAIMANT_APPLICATIONS, {
        ...content,
        usersApplications,
      });
    }
  };
}
