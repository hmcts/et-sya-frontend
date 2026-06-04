import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { fromApiFormat } from '../../helper/ApiFormatter';
import { getLogger } from '../../logger';
import { getCaseApi } from '../../services/CaseService';

import { handleUpdateDraftCase, setUserCase } from './CaseHelpers';
import { populateClaimantRepDetailsFromCase } from './ClaimantRepAnswersHelper';
import { handleErrors, returnSessionErrors } from './ErrorHelpers';
import { getPageContent } from './FormHelpers';
import { setUrlLanguage } from './LanguageHelper';
import { getLanguageParam } from './RouterHelpers';

const logger = getLogger('ClaimantRepAboutYouHelper');

export const isClaimantRepAboutYouFlow = (req: AppRequest): boolean =>
  !!req.session?.repAboutYouCaseId || req.url?.includes('redirect=rep-about-you');

export const withRepAboutYouSubmitButton = (formContent: FormContent): FormContent => ({
  ...formContent,
  submit: {
    text: (l: AnyRecord): string => l.submitBtn,
    classes: formContent.submit?.classes ?? 'govuk-!-margin-right-2',
  },
});

export const getRepAboutYouPageContent = (
  req: AppRequest,
  formContent: FormContent,
  translationKeys: string[]
): AnyRecord => {
  const isRepAboutYou = isClaimantRepAboutYouFlow(req);
  const translations = isRepAboutYou ? [...translationKeys, TranslationKeys.CLAIMANT_REP_ABOUT_YOU] : translationKeys;
  return getPageContent(req, isRepAboutYou ? withRepAboutYouSubmitButton(formContent) : formContent, translations);
};

export const getClaimantRepAboutYouPageUrl = (caseId: string, req: AppRequest): string =>
  PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId) + getLanguageParam(req.url);

export const clearRepAboutYouFlow = (req: AppRequest): void => {
  req.session.repAboutYouCaseId = undefined;
};

export const loadClaimantRepCase = async (req: AppRequest, caseId: string): Promise<boolean> => {
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

export const handleRepAboutYouFieldPost = async (
  req: AppRequest,
  res: Response,
  form: Form,
  fieldLogger: LoggerInstance
): Promise<void> => {
  setUserCase(req, form);
  const errors = returnSessionErrors(req, form);
  if (errors.length) {
    handleErrors(req, res, errors);
    return;
  }

  req.session.errors = [];
  await handleUpdateDraftCase(req, fieldLogger);

  const caseId = req.session.repAboutYouCaseId ?? req.params.caseId ?? req.session.userCase?.id;
  clearRepAboutYouFlow(req);
  return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
};
