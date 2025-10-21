import { AxiosResponse } from 'axios';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LoggerInstance } from 'winston';

import { Form } from '../../components/form/form';
import { DocumentUploadResponse } from '../../definitions/api/documentApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseDataCacheKey, CaseDate, CaseType, CaseWithId, StillWorking, YesOrNo } from '../../definitions/case';
import { TseAdminDecisionItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, languages } from '../../definitions/constants';
import { TypesOfClaim, sectionStatus } from '../../definitions/definition';
import { HubLinkStatus } from '../../definitions/hub';
import { fromApiFormat } from '../../helper/ApiFormatter';
import { Logger } from '../../logger';
import localesCy from '../../resources/locales/cy/translation/common.json';
import locales from '../../resources/locales/en/translation/common.json';
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
    userDataMap.get(CaseDataCacheKey.CASE_TYPE) === CaseType.MULTIPLE.toString() ? CaseType.MULTIPLE : CaseType.SINGLE;
  req.session.userCase.typeOfClaim = JSON.parse(userDataMap.get(CaseDataCacheKey.TYPES_OF_CLAIM));
};

export const handleUpdateDraftCase = async (req: AppRequest, logger: Logger): Promise<void> => {
  if (!req.session.errors?.length) {
    try {
      const response = await getCaseApi(req.session.user?.accessToken).updateDraftCase(req.session.userCase);
      logger.info(`Updated draft case id: ${req.session.userCase.id}`);
      const workEnterPostcode = req.session.userCase.workEnterPostcode;
      const addressEnterPostcode = req.session.userCase.addressEnterPostcode;
      const respondentEnterPostcode = req.session.userCase.respondentEnterPostcode;
      const addressAddresses = req.session.userCase.addressAddresses;
      const workAddresses = req.session.userCase.workAddresses;
      const respondentAddresses = req.session.userCase.respondentAddresses;
      const workAddressTypes = req.session.userCase.workAddressTypes;
      const respondentAddressTypes = req.session.userCase.respondentAddressTypes;
      const addressAddressTypes = req.session.userCase.addressAddressTypes;
      req.session.userCase = fromApiFormat(response.data);
      if (req.session.userCase.workEnterPostcode === undefined) {
        req.session.userCase.workEnterPostcode = workEnterPostcode;
      }
      if (req.session.userCase.addressEnterPostcode === undefined) {
        req.session.userCase.addressEnterPostcode = addressEnterPostcode;
      }
      if (req.session.userCase.respondentEnterPostcode === undefined) {
        req.session.userCase.respondentEnterPostcode = respondentEnterPostcode;
      }
      req.session.userCase.addressAddresses = addressAddresses;
      req.session.userCase.workAddresses = workAddresses;
      req.session.userCase.respondentAddresses = respondentAddresses;
      req.session.userCase.workAddressTypes = workAddressTypes;
      req.session.userCase.respondentAddressTypes = respondentAddressTypes;
      req.session.userCase.addressAddressTypes = addressAddressTypes;
      req.session.userCase.updateDraftCaseError = undefined;
      req.session.save();
    } catch (error) {
      req.session.userCase.updateDraftCaseError = req.url?.includes(languages.WELSH_URL_POSTFIX)
        ? localesCy.updateDraftErrorMessage
        : locales.updateDraftErrorMessage;
      req.session.returnUrl = req.url;
      req.session.save();
      logger.error(error.message);
    }
  }
};

export const handleUpdateHubLinksStatuses = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).updateHubLinksStatuses(req.session.userCase);
    logger.info(`Updated hub links statuses for case: ${req.session.userCase.id}`);
  } catch (error) {
    logger.error(`Failed to update hub links statuses for case ${req.session.userCase.id}: ${error.message}`);
  }
};

export const submitClaimantTse = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).submitClaimantTse(req.session.userCase);
    logger.info(`Submitted claimant tse for case: ${req.session.userCase.id}`);
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const submitBundlesHearingDocs = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).submitBundlesHearingDoc(req.session.userCase);
    logger.info(`Submitted bundles hearing doc info for case: ${req.session.userCase.id}`);
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const respondToApplication = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).respondToApplication(req.session.userCase);
    logger.info(`Responded to application for case: ${req.session.userCase.id}`);
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const updateSendNotificationState = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).updateSendNotificationState(req.session.userCase);
    logger.info(`Updated state for selectedRequestOrOrder: ${req.session.userCase.selectedRequestOrOrder.id}`);
  } catch (error) {
    logger.error(error.message);
  }
};

export const updateJudgmentNotificationState = async (
  selectedJudgment: SendNotificationTypeItem,
  req: AppRequest,
  logger: Logger
): Promise<void> => {
  try {
    selectedJudgment.value.notificationState = HubLinkStatus.VIEWED;
    await getCaseApi(req.session.user?.accessToken).updateJudgmentNotificationState(
      selectedJudgment,
      req.session.userCase
    );
    logger.info(
      `Updated state for selected judgment: ${
        req.session.userCase.sendNotificationCollection[parseInt(selectedJudgment.value.number) - 1].id
      }`
    );
  } catch (error) {
    logger.error(error.message);
  }
};

export const updateDecisionState = async (
  appId: string,
  selectedDecision: TseAdminDecisionItem,
  req: AppRequest,
  logger: Logger
): Promise<void> => {
  try {
    selectedDecision.value.decisionState = HubLinkStatus.VIEWED;
    await getCaseApi(req.session.user?.accessToken).updateDecisionState(appId, selectedDecision, req.session.userCase);
    logger.info(`Updated state for selected decision: ${selectedDecision.id}`);
  } catch (error) {
    logger.error(error.message);
  }
};

export const addResponseSendNotification = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).addResponseSendNotification(req.session.userCase);
    logger.info(`Responded to sendNotification: ${req.session.userCase.selectedRequestOrOrder.id}`);
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const getSectionStatus = (
  detailsCheckValue: YesOrNo,
  sessionValue: string | CaseDate | number
): sectionStatus => {
  if (detailsCheckValue === YesOrNo.YES) {
    return sectionStatus.completed;
  } else if (!sessionValue) {
    return sectionStatus.notStarted;
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
    (!!sessionValue && typesOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL) && isStillWorking) ||
    ((!!sessionValue || isStillWorking) && !typesOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL))
  ) {
    return sectionStatus.inProgress;
  } else {
    return sectionStatus.notStarted;
  }
};

export const handleUploadDocument = async (
  req: AppRequest,
  file: UploadedFile,
  logger: Logger
): Promise<AxiosResponse<DocumentUploadResponse>> => {
  try {
    const result: AxiosResponse<DocumentUploadResponse> = await getCaseApi(
      req.session.user?.accessToken
    ).uploadDocument(file, req.session.userCase?.caseTypeId);
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
  redirectUrl: string,
  shouldUseRedirectUrl?: boolean,
  isDynamic?: boolean
): Promise<void> => {
  setUserCase(req, form);
  await postLogic(req, res, form, logger, redirectUrl, shouldUseRedirectUrl, isDynamic);
};

export const handlePostLogicForRespondent = async (
  req: AppRequest,
  res: Response,
  form: Form,
  logger: LoggerInstance,
  redirectUrl: string,
  shouldUseRedirectUrl?: boolean,
  isDynamic?: boolean
): Promise<void> => {
  setUserCaseForRespondent(req, form);
  await postLogic(req, res, form, logger, redirectUrl, shouldUseRedirectUrl, isDynamic);
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
  redirectUrl: string,
  shouldUseRedirectUrl?: boolean,
  isDynamic?: boolean
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
      shouldUseRedirectUrl ? res.redirect(redirectUrl) : returnNextPage(req, res, redirectUrl, isDynamic);
    }
  } else {
    handleErrors(req, res, errors);
  }
};

export const clearTseFields = (userCase: CaseWithId): void => {
  userCase.contactApplicationText = undefined;
  userCase.contactApplicationFile = undefined;
  userCase.copyToOtherPartyYesOrNo = undefined;
  userCase.copyToOtherPartyText = undefined;
  userCase.storeState = undefined;
  userCase.responseText = undefined;
  userCase.hasSupportingMaterial = undefined;
  userCase.supportingMaterialFile = undefined;
  userCase.selectedRequestOrOrder = undefined;
  userCase.isRespondingToRequestOrOrder = undefined;
};

export const clearPrepareDocumentsForHearingFields = (userCase: CaseWithId): void => {
  userCase.bundlesRespondentAgreedDocWith = undefined;
  userCase.bundlesRespondentAgreedDocWithBut = undefined;
  userCase.bundlesRespondentAgreedDocWithNo = undefined;
};

export const clearBundlesFields = (userCase: CaseWithId): void => {
  userCase.whatAreTheseDocuments = undefined;
  userCase.whoseHearingDocumentsAreYouUploading = undefined;
  userCase.hearingDocumentsAreFor = undefined;
  userCase.hearingDocument = undefined;
  userCase.bundlesRespondentAgreedDocWith = undefined;
  userCase.bundlesRespondentAgreedDocWithBut = undefined;
  userCase.bundlesRespondentAgreedDocWithNo = undefined;
  userCase.formattedSelectedHearing = undefined;
};

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

export const convertJsonArrayToTitleCase = (jsonArray: Record<string, string>[]): Record<string, string>[] => {
  return jsonArray.map(addressObj => {
    const newObj: Record<string, string> = {};

    for (const [key, value] of Object.entries(addressObj)) {
      if (key === 'postcode') {
        newObj[key] = value;
      } else if (key === 'fullAddress') {
        const postcode = addressObj.postcode;
        const addressWithoutPostcode = value.replace(postcode, '').trim();
        newObj[key] =
          toTitleCase(addressWithoutPostcode) + (addressWithoutPostcode.endsWith(',') ? '' : ',') + ' ' + postcode;
      } else {
        newObj[key] = toTitleCase(value);
      }
    }
    return newObj;
  });
};
