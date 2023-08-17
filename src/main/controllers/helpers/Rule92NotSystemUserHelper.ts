import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls, Rule92Types } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';
import { getDueDate } from '../../helper/ApiFormatter';

import { checkIfRespondentIsSystemUser } from './CitizenHubHelper';
import { createDownloadLink } from './DocumentHelpers';
import { setUrlLanguage } from './LanguageHelper';

export const getTodayPlus7DaysStrings = (): string => {
  const today = new Date();
  return getDueDate(today.toString(), 7);
};

export const copyToOtherPartyRedirectUrl = (userCase: CaseWithId): string => {
  const isRespondentSystemUser = checkIfRespondentIsSystemUser(userCase);
  return isRespondentSystemUser ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
};

export const getCaptionText = (req: AppRequest, translations: AnyRecord): string => {
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

export const getCancelLink = (req: AppRequest): string => {
  const userCase = req.session?.userCase;
  return setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
};

export const getViewThisCorrespondenceLink = (req: AppRequest): string => {
  const userCase = req.session?.userCase;
  const link = `/application-details/${userCase.id}`;
  return setUrlLanguage(req, link);
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

export const storedRequiredSubmit = (selectedApplication: GenericTseApplicationTypeItem): boolean => {
  return selectedApplication.value.storedPending !== YesOrNo.YES;
};

export const getStoredToSubmitRedirectUrl = (
  req: AppRequest,
  selectedApplication: GenericTseApplicationTypeItem
): string => {
  const link = PageUrls.STORED_APPLICATION_CONFIRMATION + '/' + selectedApplication.id;
  return setUrlLanguage(req, link);
};
