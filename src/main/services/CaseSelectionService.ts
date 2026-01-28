import { AxiosResponse } from 'axios';
import { Response } from 'express';

import {
  translateOverallStatus,
  translateTypesOfClaims,
} from '../controllers/helpers/ApplicationTableRecordTranslationHelper';
import { getLanguageParam } from '../controllers/helpers/RouterHelpers';
import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, Respondent, YesOrNo } from '../definitions/case';
import { PageUrls, languages } from '../definitions/constants';
import { ApplicationTableRecord, CaseState } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { getCaseApi } from './CaseService';

const logger = getLogger('CaseSelectionService');

export const getUserApplications = (
  userCases: CaseWithId[],
  translations: AnyRecord,
  languageParam: string
): ApplicationTableRecord[] => {
  const apps: ApplicationTableRecord[] = [];

  for (const uCase of userCases) {
    const rec: ApplicationTableRecord = {
      userCase: uCase,
      respondents: formatRespondents(uCase.respondents),
      completionStatus: getOverallStatus(uCase, translations),
      url: getRedirectUrl(uCase, languageParam),
      url2: `/claimant-application/${uCase.id}/delete`,
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

export const getRedirectUrl = (userCase: CaseWithId, languageParam: string): string => {
  if (userCase.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
    return `/claimant-application/${userCase.id}${languageParam}`;
  } else {
    return `/citizen-hub/${userCase.id}${languageParam}`;
  }
};

export const getOverallStatus = (userCase: CaseWithId, translations: AnyRecord): string => {
  const totalSections = 4;
  let sectionCount = 0;

  if (userCase?.personalDetailsCheck === YesOrNo.YES) {
    sectionCount++;
  }

  if (userCase?.employmentAndRespondentCheck === YesOrNo.YES) {
    sectionCount++;
  }

  if (userCase?.claimDetailsCheck === YesOrNo.YES) {
    sectionCount++;
  }

  const allSectionsCompleted = !!(
    userCase?.personalDetailsCheck === YesOrNo.YES &&
    userCase?.employmentAndRespondentCheck === YesOrNo.YES &&
    userCase?.claimDetailsCheck === YesOrNo.YES
  );

  if (allSectionsCompleted) {
    sectionCount++;
  }

  const overallStatus: AnyRecord = {
    sectionCount,
    totalSections,
  };

  return translateOverallStatus(overallStatus, translations);
};

export const getUserCasesByLastModified = async (req: AppRequest): Promise<CaseWithId[]> => {
  try {
    const cases = await getCaseApi(req.session.user?.accessToken).getUserCases();
    if (cases.data.length === 0) {
      return [];
    } else {
      logger.info(`Retrieving cases for ${req.session.user?.id}`);
      const casesByLastModified: CaseApiDataResponse[] = sortCasesByLastModified(cases);
      return casesByLastModified.map(app => fromApiFormat(app, req));
    }
  } catch (err) {
    logger.error(err.message);
    return [];
  }
};

export const selectUserCase = async (req: AppRequest, res: Response, caseId: string): Promise<void> => {
  if (caseId === 'newClaim') {
    req.session.userCase = undefined;
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = PageUrls.CHECKLIST + languageParam;
    return res.redirect(redirectUrl);
  }
  try {
    const response = await getCaseApi(req.session.user?.accessToken).getUserCase(caseId);
    if (response.data === undefined || response.data === null) {
      const redirectUrl = req.url.includes(languages.WELSH_URL_PARAMETER)
        ? PageUrls.LIP_OR_REPRESENTATIVE + languages.WELSH_URL_PARAMETER
        : PageUrls.LIP_OR_REPRESENTATIVE + languages.ENGLISH_URL_PARAMETER;
      return res.redirect(redirectUrl);
    } else {
      req.session.userCase = fromApiFormat(response.data);
      req.session.save();
      const redirectUrl = req.url.includes(languages.WELSH_URL_PARAMETER)
        ? PageUrls.CLAIM_STEPS + languages.WELSH_URL_PARAMETER
        : PageUrls.CLAIM_STEPS + languages.ENGLISH_URL_PARAMETER;
      return res.redirect(redirectUrl);
    }
  } catch (err) {
    logger.error(err.message);
    const redirectUrl = req.url.includes(languages.WELSH_URL_PARAMETER)
      ? PageUrls.HOME + languages.WELSH_URL_PARAMETER
      : PageUrls.HOME + languages.ENGLISH_URL_PARAMETER;
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
