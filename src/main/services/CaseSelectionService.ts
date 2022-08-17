import { Response } from 'express';

import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls, Urls } from '../definitions/constants';
import { ApplicationTableRecord, CaseState } from '../definitions/definition';
import { fromApiFormat } from '../helper/ApiFormatter';

import { getCaseApi } from './CaseService';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export const getUserApplications = (userCases: CaseWithId[]): ApplicationTableRecord[] => {
  const apps: ApplicationTableRecord[] = [];

  for (const uCase of userCases) {
    const rec: ApplicationTableRecord = {
      userCase: uCase,
      respondents: uCase.respondents?.map(respondent => respondent.respondentName).join('<br />'),
      completionStatus: getOverallStatus(uCase),
      url: getRedirectUrl(uCase),
    };
    apps.push(rec);
  }
  return apps;
};

export const getRedirectUrl = (userCase: CaseWithId): string => {
  if (userCase.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
    return `/claimant-application/${userCase.id}`;
  } else {
    return Urls.DOWNLOAD_CLAIM;
  }
};

export const getOverallStatus = (userCase: CaseWithId): string => {
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

  return `${sectionCount} of ${totalSections} tasks completed`;
};

export const getUserCasesByLastModified = async (req: AppRequest): Promise<CaseWithId[]> => {
  try {
    const cases = await getCaseApi(req.session.user?.accessToken).getUserCases();
    if (cases.data.length === 0) {
      return [];
    } else {
      logger.info(`Retrieving cases for ${req.session.user?.id}`);
      const casesByLastModified: CaseApiDataResponse[] = cases.data.sort((a, b) => {
        const da = new Date(a.last_modified),
          db = new Date(b.last_modified);
        return db.valueOf() - da.valueOf();
      });
      return casesByLastModified.map(app => fromApiFormat(app));
    }
  } catch (err) {
    logger.log(err);
    return [];
  }
};

export const selectUserCase = async (req: AppRequest, res: Response, caseId: string): Promise<void> => {
  if (caseId === 'newClaim') {
    req.session.userCase = undefined;
    res.redirect(PageUrls.HOME);
  }
  try {
    const response = await getCaseApi(req.session.user?.accessToken).getUserCase(caseId);
    if (response.data === undefined || response.data === null) {
      res.redirect(PageUrls.LIP_OR_REPRESENTATIVE);
    } else {
      req.session.userCase = fromApiFormat(response.data);
      req.session.save();
      res.redirect(PageUrls.CLAIM_STEPS);
    }
  } catch (err) {
    logger.log(err);
    res.redirect(PageUrls.HOME);
  }
};
