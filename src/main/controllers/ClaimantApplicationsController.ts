import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, Roles, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getUserApplications, getUserCasesByLastModified } from '../services/CaseSelectionService';

import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantApplicationsController');

export default class ClaimantApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.caseAssignmentFields = {}; // Clear case assignment flow fields
    req.session.visitedAssignClaimFlow = true; // Allow navigation to CaseNumberController
    req.session.caseNumberChecked = false;
    req.session.yourDetailsVerified = false;

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

    // Fetch each tab's cases by the user's assigned case role: their own claims ([CREATOR])
    // and the claims they are representing someone else on ([CLAIMANTNONLEGALREPRESENTATIVE]).
    const [myClaimsCases, representingCases] = await Promise.all([
      getUserCasesByLastModified(req, Roles.CREATOR_ROLE_WITH_BRACKETS),
      getUserCasesByLastModified(req, Roles.CLAIMANT_NON_LEGAL_REP_WITH_BRACKETS),
    ]);
    const userCases = [...myClaimsCases, ...representingCases];
    if (userCases.length === 0) {
      req.session.hasUserCases = false;
      return res.redirect(PageUrls.HOME);
    } else {
      const languageParam = getLanguageParam(req.url);
      const myClaimsApplications = getUserApplications(myClaimsCases, translations, languageParam);
      const representingApplications = getUserApplications(representingCases, translations, languageParam);
      req.session.userCases = userCases;
      req.session.hasUserCases = true;

      // Only show the "My Applications" / "Representing others" tabs when the user has both their
      // own claims and claims they are representing. Otherwise the single non-empty set is shown
      // on its own, so each set is only ever rendered in its own view.
      const showTabs = myClaimsApplications.length > 0 && representingApplications.length > 0;

      res.render(TranslationKeys.CLAIMANT_APPLICATIONS, {
        ...content,
        myClaimsApplications,
        representingApplications,
        showTabs,
        currentUrl: PageUrls.CLAIMANT_APPLICATIONS,
      });
    }
  };
}
