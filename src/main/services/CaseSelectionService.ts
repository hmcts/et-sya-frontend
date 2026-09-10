import { AxiosResponse } from 'axios';
import { Response } from 'express';

import {
  translateOverallStatus,
  translateTypesOfClaims,
} from '../controllers/helpers/ApplicationTableRecordTranslationHelper';
import { clearCaseTransferInfoIfStale, handleTransferredCaseRedirect } from '../controllers/helpers/CaseTransferHelper';
import { getClaimStepsUrl, returnSafeCitizenHubUrl } from '../controllers/helpers/RouterHelpers';
import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, Respondent, YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls, languages } from '../definitions/constants';
import { ApplicationTableRecord, CaseState } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';
import { formatDate, fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { getCaseApi } from './CaseService';

const logger = getLogger('CaseSelectionService');

export const getUserApplications = (
  userCases: CaseWithId[],
  translations: AnyRecord,
  languageParam: string,
  isRepresenting = false
): ApplicationTableRecord[] => {
  const apps: ApplicationTableRecord[] = [];

  for (const uCase of userCases) {
    const rec: ApplicationTableRecord = {
      userCase: uCase,
      respondents: formatRespondents(uCase.respondents),
      completionStatus: getOverallStatus(uCase, translations),
      url: getRedirectUrl(uCase, languageParam, isRepresenting),
      claimSubmittedDate: formatDate(uCase.submittedDate),
      deleteDraftUrl: `/claimant-application/${uCase.id}/delete${languageParam}&redirect=claimant-applications`,
    };
    translateTypesOfClaims(rec, translations);
    apps.push(rec);
  }
  return apps;
};

export const formatRespondents = (respondents?: Respondent[]): string => {
  if (respondents === undefined) {
    return 'undefined';
  }
  return respondents.map(respondent => respondent.respondentName).join('<br />');
};

export const getRedirectUrl = (userCase: CaseWithId, languageParam: string, isRepresenting = false): string => {
  if (userCase.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
    return `/claimant-application/${userCase.id}${languageParam}`;
  } else if (isRepresenting) {
    return `/claimant-rep-hub/${userCase.id}${languageParam}`;
  } else {
    return `/citizen-hub/${userCase.id}${languageParam}`;
  }
};

export const getOverallStatus = (userCase: CaseWithId, translations: AnyRecord): string => {
  const sectionChecks =
    userCase?.claimantRepresentedQuestion === YesOrNo.YES
      ? [
          userCase?.representativeDetailsCheck,
          userCase?.representedClaimantDetailsCheck,
          userCase?.employmentAndRespondentCheck,
          userCase?.claimDetailsCheck,
        ]
      : [userCase?.personalDetailsCheck, userCase?.employmentAndRespondentCheck, userCase?.claimDetailsCheck];

  // The final task is submitting the claim, which only opens once every section is complete
  const totalSections = sectionChecks.length + 1;
  const completedSections = sectionChecks.filter(check => check === YesOrNo.YES).length;
  const allSectionsCompleted = completedSections === sectionChecks.length;

  const overallStatus: AnyRecord = {
    sectionCount: allSectionsCompleted ? completedSections + 1 : completedSections,
    totalSections,
  };

  return translateOverallStatus(overallStatus, translations);
};

export const getUserCasesByLastModified = async (req: AppRequest, caseUserRole?: string): Promise<CaseWithId[]> => {
  try {
    const cases = await getCaseApi(req.session.user?.accessToken).getUserCases(caseUserRole);
    if (cases.data.length === 0) {
      return [];
    } else {
      logger.info(`Retrieving cases for ${req.session.user?.id}`);
      let casesByLastModified: CaseApiDataResponse[] = sortCasesByLastModified(cases);

      const deletedCaseIds = req.session?.deletedCaseIds;
      if (deletedCaseIds && deletedCaseIds.length > 0) {
        const deletedIds = new Set(deletedCaseIds.map(id => String(id).trim()));
        casesByLastModified = casesByLastModified.filter(app => !deletedIds.has(String(app.id).trim()));
      }
      logger.info(`${casesByLastModified.length} cases for user ${req.session.user?.id} after filtering deleted cases`);
      return casesByLastModified.flatMap(app => {
        try {
          return [fromApiFormat(app, req)];
        } catch (err) {
          logger.error(`Failed to format case ${app.id}: ${err instanceof Error ? err.message : String(err)}`);
          return [];
        }
      });
    }
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err));
    return [];
  }
};

const getCaseDestinationUrl = (userCase: CaseWithId, req: AppRequest): string => {
  if (userCase.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
    // getClaimStepsUrl returns one of two constants, and the language comes from constant
    // branches only, so the redirect URL is not treated as unvalidated
    const claimStepsUrl = getClaimStepsUrl(req);
    return req.url?.includes(languages.WELSH_URL_PARAMETER)
      ? claimStepsUrl + languages.WELSH_URL_PARAMETER
      : claimStepsUrl + languages.ENGLISH_URL_PARAMETER;
  }
  return returnSafeCitizenHubUrl(userCase.id, req);
};

export const selectUserCase = async (req: AppRequest, res: Response, caseId: string): Promise<void> => {
  if (caseId === 'newClaim') {
    Reflect.deleteProperty(req.session, 'userCase');
    // Language comes from constant branches only, so the redirect URL is not treated as unvalidated
    const redirectUrl = req.url?.includes(languages.WELSH_URL_PARAMETER)
      ? PageUrls.CHECKLIST + languages.WELSH_URL_PARAMETER
      : PageUrls.CHECKLIST + languages.ENGLISH_URL_PARAMETER;
    return res.redirect(redirectUrl);
  }
  try {
    const response = await getCaseApi(req.session.user?.accessToken).getUserCase(caseId);
    if (response.data === undefined || response.data === null) {
      // Language comes from constant branches only, so the redirect URL is not treated as unvalidated
      const redirectUrl = req.url?.includes(languages.WELSH_URL_PARAMETER)
        ? PageUrls.LIP_OR_REPRESENTATIVE + languages.WELSH_URL_PARAMETER
        : PageUrls.LIP_OR_REPRESENTATIVE + languages.ENGLISH_URL_PARAMETER;
      return res.redirect(redirectUrl);
    }

    req.session.userCase = fromApiFormat(response.data);
    clearCaseTransferInfoIfStale(req, caseId);

    req.session.save();
    return res.redirect(getCaseDestinationUrl(req.session.userCase, req));
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error(errorMessage);
    if (await handleTransferredCaseRedirect(req, res, caseId, err)) {
      return;
    }
    // Language comes from constant branches only, so the redirect URL is not treated as unvalidated
    const redirectUrl = req.url?.includes(languages.WELSH_URL_PARAMETER)
      ? ErrorPages.NOT_FOUND + languages.WELSH_URL_PARAMETER
      : ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER;
    return res.redirect(redirectUrl);
  }
};

export const sortCasesByLastModified = (cases: AxiosResponse<CaseApiDataResponse[]>): CaseApiDataResponse[] => {
  return cases.data.sort((a, b) => {
    const da = new Date(a.last_modified),
      db = new Date(b.last_modified);
    return db.valueOf() - da.valueOf();
  });
};
