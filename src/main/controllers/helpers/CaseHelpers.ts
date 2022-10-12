import { AxiosResponse } from 'axios';
import { cloneDeep } from 'lodash';
import { parse } from 'postcode';
import { LoggerInstance } from 'winston';

import { Form } from '../../components/form/form';
import { DocumentUploadResponse } from '../../definitions/api/documentApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseDataCacheKey, CaseDate, CaseType, CaseWithId, YesOrNo } from '../../definitions/case';
import { mvpLocations } from '../../definitions/constants';
import { sectionStatus } from '../../definitions/definition';
import { fromApiFormat } from '../../helper/ApiFormatter';
import { UploadedFile, getCaseApi } from '../../services/CaseService';

import { resetValuesIfNeeded } from './FormHelpers';

export const setUserCase = (req: AppRequest, form: Form): void => {
  const formData = form.getParsedBody(cloneDeep(req.body), form.getFormFields());
  if (!req.session.userCase) {
    req.session.userCase = {} as CaseWithId;
  }
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

export const handleUpdateDraftCase = (req: AppRequest, logger: LoggerInstance): void => {
  if (!req.session.errors?.length) {
    getCaseApi(req.session.user?.accessToken)
      .updateDraftCase(req.session.userCase)
      .then(response => {
        logger.info(`Updated draft case id: ${req.session.userCase.id}`);
        req.session.userCase = fromApiFormat(response.data);
        req.session.save();
      })
      .catch(error => {
        logger.error(error);
      });
  }
};

export const handleUpdateSubmittedCase = (req: AppRequest, logger: LoggerInstance): void => {
  getCaseApi(req.session.user?.accessToken)
    .updateSubmittedCase(req.session.userCase)
    .then(() => {
      logger.info(`Updated submitted case id: ${req.session.userCase.id}`);
    })
    .catch(error => {
      logger.error(error);
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

export const isPostcodeMVPLocation = (postCode: string): boolean => {
  const {
    outcode, // => "SW1A"
    area, // => "SW"
    district, // => "SW1"
  } = parse(postCode);
  for (const mvpLocation of mvpLocations) {
    if (mvpLocation === outcode || mvpLocation === area || mvpLocation === district) {
      return true;
    }
  }
  return false;
};

export const handleUploadDocument = async (
  req: AppRequest,
  file: UploadedFile,
  logger: LoggerInstance
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
