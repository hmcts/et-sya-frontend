import { AxiosResponse } from 'axios';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { parse } from 'postcode';
import { LoggerInstance } from 'winston';

import { Form } from '../../components/form/form';
import { DocumentUploadResponse } from '../../definitions/api/documentApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseDataCacheKey, CaseDate, CaseType, CaseWithId, StillWorking, YesOrNo } from '../../definitions/case';
import { PageUrls, inScopeLocations } from '../../definitions/constants';
import { TypesOfClaim, sectionStatus } from '../../definitions/definition';
import { fromApiFormat } from '../../helper/ApiFormatter';
import { Logger } from '../../logger';
import { UploadedFile, getCaseApi } from '../../services/CaseService';

import { handleErrors, returnSessionErrors } from './ErrorHelpers';
import { resetValuesIfNeeded, trimFormData } from './FormHelpers';
import { setUrlLanguage } from './LanguageHelper';
import { setUserCaseForRespondent } from './RespondentHelpers';
import { returnNextPage } from './RouterHelpers';

export const setUserCase = (req: AppRequest, form: Form): void => {
  const formData = form.getParsedBody(cloneDeep(req.body), form.getFormFields());
  if (!req.session.userCase) {
    req.session.userCase = {} as CaseWithId;
  }
  trimFormData(formData);
  resetValuesIfNeeded(formData);
  Object.assign(req.session.userCase, formData);
};

export const setUserCaseWithRedisData = (req: AppRequest, caseData: string): void => {
  if (!req.session.userCase) {
    req.session.userCase = {} as CaseWithId;
  }
  const userDataMap: Map<CaseDataCacheKey, string> = new Map(JSON.parse(caseData));
  req.session.userCase.claimantRepresentedQuestion =
    userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED) === YesOrNo.YES.toString() ? YesOrNo.YES : YesOrNo.NO;
  req.session.userCase.caseType =
    userDataMap.get(CaseDataCacheKey.CASE_TYPE) === CaseType.SINGLE.toString() ? CaseType.SINGLE : CaseType.MULTIPLE;
  req.session.userCase.typeOfClaim = JSON.parse(userDataMap.get(CaseDataCacheKey.TYPES_OF_CLAIM));
};

export const handleUpdateDraftCase = async (req: AppRequest, logger: Logger): Promise<void> => {
  if (!req.session.errors?.length) {
    try {
      const response = await getCaseApi(req.session.user?.accessToken).updateDraftCase(req.session.userCase);
      logger.info(`Updated draft case id: ${req.session.userCase.id}`);
      req.session.userCase = fromApiFormat(response.data);
      req.session.save();
    } catch (error) {
      logger.error(error.message);
    }
  }
};

export const handleUpdateHubLinksStatuses = (req: AppRequest, logger: Logger): void => {
  getCaseApi(req.session.user?.accessToken)
    .updateHubLinksStatuses(req.session.userCase)
    .then(() => {
      logger.info(`Updated hub links statuses for case: ${req.session.userCase.id}`);
    })
    .catch(error => {
      logger.error(error.message);
    });
};

export const getSectionStatus = (
  detailsCheckValue: YesOrNo,
  sessionValue: string | CaseDate | number
): sectionStatus => {
  if (detailsCheckValue === YesOrNo.YES) {
    return sectionStatus.completed;
  } else if (detailsCheckValue === YesOrNo.NO || !!sessionValue) {
    return sectionStatus.inProgress;
  } else {
    return sectionStatus.notStarted;
  }
};

export const getSectionStatusForEmployment = (
  detailsCheckValue: YesOrNo,
  sessionValue: string | CaseDate | number,
  typesOfClaim: string[],
  isStillWorking: StillWorking
): sectionStatus => {
  if (detailsCheckValue === YesOrNo.YES) {
    return sectionStatus.completed;
  } else if (
    detailsCheckValue === YesOrNo.NO ||
    (!!sessionValue && typesOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL) && isStillWorking) ||
    ((!!sessionValue || isStillWorking) && !typesOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL))
  ) {
    return sectionStatus.inProgress;
  } else {
    return sectionStatus.notStarted;
  }
};

export const isPostcodeInScope = (postCode: string): boolean => {
  const {
    outcode, // => "SW1A"
    area, // => "SW"
    district, // => "SW1"
  } = parse(postCode);
  for (const location of inScopeLocations) {
    if (location === outcode || location === area || location === district) {
      return true;
    }
  }
  return false;
};

export const handleUploadDocument = async (
  req: AppRequest,
  file: UploadedFile,
  logger: Logger
): Promise<AxiosResponse<DocumentUploadResponse>> => {
  try {
    const result: AxiosResponse<DocumentUploadResponse> = await getCaseApi(
      req.session.user?.accessToken
    ).uploadDocument(file, 'ET_EnglandWales');
    logger.info(`Uploaded document to: ${result.data._links.self.href}`);
    return result;
  } catch (err) {
    logger.error(err.message);
  }
};

export const handlePostLogic = async (
  req: AppRequest,
  res: Response,
  form: Form,
  logger: LoggerInstance,
  redirectUrl: string
): Promise<void> => {
  setUserCase(req, form);
  await postLogic(req, res, form, logger, redirectUrl);
};

export const handlePostLogicForRespondent = async (
  req: AppRequest,
  res: Response,
  form: Form,
  logger: LoggerInstance,
  redirectUrl: string
): Promise<void> => {
  setUserCaseForRespondent(req, form);
  await postLogic(req, res, form, logger, redirectUrl);
};

export const handlePostLogicPreLogin = (req: AppRequest, res: Response, form: Form, redirectUrl: string): void => {
  setUserCase(req, form);
  const errors = returnSessionErrors(req, form);
  if (errors.length === 0) {
    req.session.errors = [];
    returnNextPage(req, res, setUrlLanguage(req, redirectUrl));
  } else {
    handleErrors(req, res, errors);
  }
};

export const postLogic = async (
  req: AppRequest,
  res: Response,
  form: Form,
  logger: LoggerInstance,
  redirectUrl: string
): Promise<void> => {
  const errors = returnSessionErrors(req, form);
  const { saveForLater } = req.body;
  if (errors.length === 0) {
    req.session.errors = [];
    await handleUpdateDraftCase(req, logger);
    if (saveForLater) {
      redirectUrl = setUrlLanguage(req, PageUrls.CLAIM_SAVED);
      return res.redirect(redirectUrl);
    } else {
      redirectUrl = setUrlLanguage(req, redirectUrl);
      returnNextPage(req, res, redirectUrl);
    }
  } else {
    handleErrors(req, res, errors);
  }
};
