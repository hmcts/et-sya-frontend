import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls, Rule92Types, TranslationKeys } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';
import { getDueDate } from '../../helper/ApiFormatter';

import { getTseApplicationDetails } from './ApplicationDetailsHelper';
import { checkIfRespondentIsSystemUser } from './CitizenHubHelper';
import { createDownloadLink, findSelectedGenericTseApplication } from './DocumentHelpers';
import { setUrlLanguage } from './LanguageHelper';

export const getTodayPlus7DaysStrings = (): string => {
  const today = new Date();
  return getDueDate(today.toString(), 7);
};

export const copyToOtherPartyRedirectUrl = (userCase: CaseWithId): string => {
  const isRespondentSystemUser = checkIfRespondentIsSystemUser(userCase);
  return isRespondentSystemUser ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
};

export const getCancelLink = (req: AppRequest): string => {
  const userCase = req.session?.userCase;
  return setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
};

export const getViewSupportingDoc = (userCase: CaseWithId, translations: AnyRecord): string => {
  if (userCase?.contactApplicationFile === undefined) {
    return '';
  }
  return (
    translations.viewTheSupportingDocuments +
    ': <a href="' +
    createDownloadLink(userCase?.contactApplicationFile) +
    '" class="govuk-link">' +
    userCase?.contactApplicationFile.document_filename +
    '</a>'
  );
};

export const getViewThisCorrespondenceLink = (userCase: CaseWithId, languageParam: string): string => {
  return getStoredCopiedConfirmFormLink(userCase.id, languageParam);
};

export const getStoredPendingApplicationLinks = (
  apps: GenericTseApplicationTypeItem[],
  languageParam: string
): string[] => {
  return apps
    ?.filter(app => app.value.storedPending === YesOrNo.YES)
    .map(app => getStoredCopiedConfirmFormLink(app.id, languageParam));
};

const getStoredCopiedConfirmFormLink = (correspondenceId: string, languageParam: string): string => {
  return PageUrls.COPIED_CORRESPONDENCE_CONFIRMATION + '/' + correspondenceId + languageParam;
};

export const getCaptionText = (req: AppRequest): string => {
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
  };
  return getCaptionTextWithTranslations(req, translations);
};

export const getCaptionTextWithTranslations = (req: AppRequest, translations: AnyRecord): string => {
  const contactType = req.session.contactType;
  if (contactType === Rule92Types.CONTACT) {
    const captionSubject = req.session.userCase.contactApplicationType;
    return translations.sections[captionSubject]?.caption;
  }
  if (contactType === Rule92Types.RESPOND) {
    return translations.respondToApplication;
  }
  if (contactType === Rule92Types.TRIBUNAL) {
    return translations.respondToTribunal;
  }
  return '';
};

export const getTseApplicationDetailsTable = (
  req: AppRequest
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  const userCase = req.session.userCase;
  const selectedApplication = findSelectedGenericTseApplication(
    userCase.genericTseApplicationCollection,
    req.params.appId
  );
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };
  const document = selectedApplication.value?.documentUpload;
  const downloadLink = createDownloadLink(document);
  return getTseApplicationDetails(selectedApplication, translations, downloadLink);
};
