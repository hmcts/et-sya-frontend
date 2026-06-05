import { Response } from 'express';

import { validateClaimantRepAboutYou } from '../components/form/claim-details-validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handleUpdateClaimantRepAboutYou, handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';
import { clearRepAboutYouFlow, loadClaimantRepCase } from './helpers/ClaimantRepAboutYouHelper';
import { getClaimantRepAboutYouDetails } from './helpers/ClaimantRepAnswersHelper';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantRepAboutYouController');

export default class ClaimantRepAboutYouController {
  private readonly formContent: FormContent = {
    fields: {},
    submit: {
      text: (l: AnyRecord): string => l.submitBtn,
      classes: 'govuk-!-margin-right-2',
    },
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;

    if (!(await loadClaimantRepCase(req, caseId))) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    req.session.errors = [];
    if (!validateClaimantRepAboutYou(req.session.userCase)) {
      req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'invalid' });
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
    }

    await handleUpdateClaimantRepAboutYou(req, logger);
    if (req.session.userCase.updateDraftCaseError) {
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
    }

    if (!req.session.userCase.hubLinksStatuses) {
      req.session.userCase.hubLinksStatuses = {};
    }
    req.session.userCase.hubLinksStatuses[HubLinkNames.AboutYou] = HubLinkStatus.VIEWED;
    await handleUpdateHubLinksStatuses(req, logger);
    clearRepAboutYouFlow(req);

    return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_HUB.replace(':caseId', caseId)));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;

    if (!(await loadClaimantRepCase(req, caseId))) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    const userCase = req.session.userCase;
    const languageParam = getLanguageParam(req.url);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIMANT_REP_ABOUT_YOU, { returnObjects: true }),
    };

    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_REP_ABOUT_YOU,
    ]);

    res.render(TranslationKeys.CLAIMANT_REP_ABOUT_YOU, {
      ...content,
      ...translations,
      PageUrls,
      languageParam,
      userCase,
      backLinkUrl: PageUrls.CLAIMANT_REP_HUB.replace(':caseId', caseId) + languageParam,
      aboutYouRows: getClaimantRepAboutYouDetails(userCase, translations),
      contactTribunalUrl: PageUrls.CONTACT_THE_TRIBUNAL + languageParam,
    });
  };
}
