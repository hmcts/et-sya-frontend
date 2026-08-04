import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, Roles, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getUserApplications, getUserCasesByLastModified } from '../services/CaseSelectionService';

import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantApplicationsController');

// The matched role returned by /user-cases may or may not carry brackets (e.g. "[CREATOR]" vs
// "CREATOR"); normalise before comparing against the bracket-free Roles constants.
const matchesCaseUserRole = (userCase: CaseWithId, role: string): boolean =>
  (userCase.caseUserRole ?? '').replace(/[[\]]/g, '').toUpperCase() === role;

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

    // A single /user-cases call returns the user's own claims ([CREATOR]) and the claims they are
    // representing someone else on ([CLAIMANTNONLEGALREPRESENTATIVE]) — the backend auto-expands the
    // default/CREATOR request to include both. Each case carries its matched role in caseUserRole,
    // which we use to split them into the two tabs.
    const userCases = await getUserCasesByLastModified(req);
    if (userCases.length === 0) {
      req.session.hasUserCases = false;
      return res.redirect(PageUrls.HOME);
    } else {
      const languageParam = getLanguageParam(req.url);
      const myClaimsCases = userCases.filter(c => matchesCaseUserRole(c, Roles.CREATOR_ROLE_WITHOUT_BRACKETS));
      const representingCases = userCases.filter(c =>
        matchesCaseUserRole(c, Roles.CLAIMANT_NON_LEGAL_REP_WITHOUT_BRACKETS)
      );
      const myClaimsApplications = getUserApplications(myClaimsCases, translations, languageParam);
      const representingApplications = getUserApplications(representingCases, translations, languageParam);
      req.session.userCases = userCases;
      req.session.hasUserCases = true;

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
