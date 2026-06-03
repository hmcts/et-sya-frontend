import { Response } from 'express';

import { validateRepresentativeDetails } from '../components/form/claim-details-validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { handleUpdateDraftCase, handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';
import { getClaimantRepAboutYouDetails, populateClaimantRepDetailsFromCase } from './helpers/ClaimantRepAnswersHelper';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantRepAboutYouController');

export default class ClaimantRepAboutYouController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {},
    submit: submitButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  private loadCase = async (req: AppRequest, caseId: string): Promise<boolean> => {
    try {
      const caseData = await getCaseApi(req.session.user?.accessToken).getUserCase(caseId);
      req.session.userCase = fromApiFormat(caseData.data);
      populateClaimantRepDetailsFromCase(req.session.userCase);
      return true;
    } catch (error) {
      logger.error(`Error loading case ${caseId}: ${error.message}`);
      return false;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;

    if (!(await this.loadCase(req, caseId))) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    req.session.errors = [];
    if (!validateRepresentativeDetails(req.session.userCase)) {
      req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'invalid' });
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
    }

    await handleUpdateDraftCase(req, logger);
    if (req.session.userCase.updateDraftCaseError) {
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
    }

    if (!req.session.userCase.hubLinksStatuses) {
      req.session.userCase.hubLinksStatuses = {};
    }
    req.session.userCase.hubLinksStatuses[HubLinkNames.AboutYou] = HubLinkStatus.VIEWED;
    await handleUpdateHubLinksStatuses(req, logger);

    return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_HUB.replace(':caseId', caseId)));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;

    if (!(await this.loadCase(req, caseId))) {
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
      aboutYouRows: getClaimantRepAboutYouDetails(userCase, req.session.user?.email, translations, languageParam),
      contactTribunalUrl: PageUrls.CONTACT_THE_TRIBUNAL + languageParam,
    });
  };
}
