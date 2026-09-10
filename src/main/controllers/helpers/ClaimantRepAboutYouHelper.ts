import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { fromApiFormat } from '../../helper/ApiFormatter';
import { getLogger } from '../../logger';
import { getCaseApi } from '../../services/CaseService';

import { handleUpdateClaimantRepAboutYou, setUserCase } from './CaseHelpers';
import {
  applyPreservedClaimantRepSessionFields,
  populateClaimantRepDetailsFromCase,
  preserveClaimantRepSessionFields,
  syncClaimantRepresentativeFromSessionFields,
} from './ClaimantRepAnswersHelper';
import { handleErrors, returnSessionErrors } from './ErrorHelpers';
import { getPageContent } from './FormHelpers';
import { setUrlLanguage } from './LanguageHelper';
import { fillRepresentativeAddressFields } from './RespondentHelpers';
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

export const getRepAboutYouReturnUrl = (req: AppRequest): string =>
  PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(
    ':caseId',
    req.session.repAboutYouCaseId ?? req.params?.caseId ?? req.session.userCase?.id
  );

/**
 * Applies the address the representative picked from a postcode lookup and reports whether one was
 * applied. The list also holds an "N addresses found" placeholder, which carries no index and so
 * leaves the address untouched.
 */
export const applySelectedAddress = (userCase?: CaseWithId): boolean => {
  const selected = userCase?.representativeAddressTypes as unknown;
  if (selected === undefined) {
    return false;
  }

  let applied = false;
  if (typeof selected === 'string' || typeof selected === 'number') {
    const index = Number(selected);
    const addressCount = userCase.representativeAddresses?.length ?? 0;
    if (String(selected).trim() !== '' && Number.isInteger(index) && index >= 0 && index < addressCount) {
      fillRepresentativeAddressFields(index, userCase);
      applied = true;
    }
  }

  userCase.representativeAddressTypes = undefined;
  return applied;
};

/**
 * Keeps what the representative has just entered as the details shown when the page reloads.
 * Without it, the details preserved from an earlier save are re-applied over their unsaved edits.
 */
export const rememberRepAboutYouEdits = (req: AppRequest): void => {
  req.session.claimantRepAboutYouPendingDisplay = preserveClaimantRepSessionFields(req.session.userCase);
};

export const clearRepAboutYouFlow = (req: AppRequest): void => {
  req.session.repAboutYouCaseId = undefined;
};

const isSameCase = (userCase: CaseWithId | undefined, caseId: string): boolean =>
  !!userCase?.id && String(userCase.id) === String(caseId);

type RepAddressLookup = Pick<
  CaseWithId,
  'representativeEnterPostcode' | 'representativeAddresses' | 'representativeAddressTypes'
>;

/**
 * The postcode lookup lives only in the session, so it has to survive a reload of the case from the
 * API - otherwise the addresses found disappear before they can be picked from.
 */
const preserveRepAddressLookup = (userCase?: CaseWithId): RepAddressLookup | undefined =>
  userCase
    ? {
        representativeEnterPostcode: userCase.representativeEnterPostcode,
        representativeAddresses: userCase.representativeAddresses,
        representativeAddressTypes: userCase.representativeAddressTypes,
      }
    : undefined;

const applyRepAddressLookup = (userCase: CaseWithId, lookup?: RepAddressLookup): void => {
  if (!lookup) {
    return;
  }
  userCase.representativeEnterPostcode ??= lookup.representativeEnterPostcode;
  userCase.representativeAddresses ??= lookup.representativeAddresses;
  userCase.representativeAddressTypes ??= lookup.representativeAddressTypes;
};

export const refreshClaimantRepSession = (req: AppRequest, caseId: string): void => {
  const loginEmail = req.session.user?.email;
  populateClaimantRepDetailsFromCase(req.session.userCase, { loginEmail });
  applyPreservedClaimantRepSessionFields(req.session.userCase, req.session.claimantRepAboutYouPendingDisplay);
  syncClaimantRepresentativeFromSessionFields(req.session.userCase);
  req.session.repAboutYouCaseId = caseId;
};

export const loadClaimantRepCase = async (req: AppRequest, caseId: string, forceReload = false): Promise<boolean> => {
  if (!forceReload && isSameCase(req.session.userCase, caseId)) {
    refreshClaimantRepSession(req, caseId);
    return true;
  }

  try {
    const sameCase = isSameCase(req.session.userCase, caseId);
    const preservedFields = sameCase ? preserveClaimantRepSessionFields(req.session.userCase) : undefined;
    const addressLookup = sameCase ? preserveRepAddressLookup(req.session.userCase) : undefined;
    const pendingDisplay = req.session.claimantRepAboutYouPendingDisplay;
    const loginEmail = req.session.user?.email;
    const caseData = await getCaseApi(req.session.user?.accessToken).getUserCase(caseId);
    req.session.userCase = fromApiFormat(caseData.data);
    populateClaimantRepDetailsFromCase(req.session.userCase, { loginEmail });
    applyRepAddressLookup(req.session.userCase, addressLookup);
    applyPreservedClaimantRepSessionFields(req.session.userCase, preservedFields);
    applyPreservedClaimantRepSessionFields(req.session.userCase, pendingDisplay);
    syncClaimantRepresentativeFromSessionFields(req.session.userCase);
    req.session.repAboutYouCaseId = caseId;
    return true;
  } catch (error) {
    logger.error(`Error loading case ${caseId}: ${error.message}`);
    return false;
  }
};

export const ensureClaimantRepCaseLoaded = async (req: AppRequest): Promise<boolean> => {
  const caseId = req.session.repAboutYouCaseId ?? req.session.userCase?.id;
  if (!caseId) {
    return false;
  }
  if (isSameCase(req.session.userCase, caseId)) {
    refreshClaimantRepSession(req, caseId);
    return true;
  }
  return loadClaimantRepCase(req, caseId);
};

export const handleRepAboutYouPostLogic = async (
  req: AppRequest,
  res: Response,
  form: Form,
  fieldLogger: LoggerInstance,
  redirectUrl: string,
  persistToApi = false
): Promise<void> => {
  if (!(await ensureClaimantRepCaseLoaded(req))) {
    return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
  }

  setUserCase(req, form);
  const errors = returnSessionErrors(req, form);
  if (errors.length) {
    handleErrors(req, res, errors);
    return;
  }

  req.session.errors = [];

  if (persistToApi) {
    await handleUpdateClaimantRepAboutYou(req, fieldLogger);
    const caseId = req.session.repAboutYouCaseId ?? req.params.caseId ?? req.session.userCase?.id;
    req.session.repAboutYouCaseId = caseId;
    if (req.session.userCase?.updateDraftCaseError) {
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId)));
    }
    redirectUrl = PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId);
  }

  return res.redirect(setUrlLanguage(req, redirectUrl));
};

export const handleRepAboutYouFieldPost = async (
  req: AppRequest,
  res: Response,
  form: Form,
  fieldLogger: LoggerInstance
): Promise<void> => {
  const caseId = req.session.repAboutYouCaseId ?? req.params.caseId ?? req.session.userCase?.id;
  const redirectUrl = PageUrls.CLAIMANT_REP_ABOUT_YOU.replace(':caseId', caseId);
  return handleRepAboutYouPostLogic(req, res, form, fieldLogger, redirectUrl, true);
};
