import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, Document, YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { RespondentApplicationDetails } from '../../definitions/definition';
import { HubLinkStatus, statusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { getTseApplicationDecisionDetails } from './ApplicationDetailsHelper';
import { retrieveCurrentLocale } from './ApplicationTableRecordTranslationHelper';
import { clearTseFields } from './CaseHelpers';
import { createDownloadLink } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';

export const getRespondentApplications = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  return userCase?.genericTseApplicationCollection?.filter(
    app =>
      app.value.applicant.includes(Applicant.RESPONDENT) &&
      app.value.type !== 'Order a witness to attend to give evidence' &&
      app.value.copyToOtherPartyYesOrNo.includes(YesOrNo.YES)
  );
};

export const getRespondentBannerContent = (
  items: GenericTseApplicationTypeItem[],
  translations: AnyRecord,
  languageParam: string
): RespondentApplicationDetails[] => {
  const bannerContent: RespondentApplicationDetails[] = [];

  if (items?.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].value.applicationState === 'notStartedYet') {
        const dueDate = new Date(Date.parse(items[i].value.dueDate));
        const rec: RespondentApplicationDetails = {
          respondentApplicationHeader:
            translations.notificationBanner.respondentApplicationReceived.header + translations[items[i].value.type],
          respondToRespondentAppRedirectUrl: `/respondent-application-details/${items[i].id}${languageParam}`,
          applicant: items[i].value.applicant,
          copyToOtherPartyYesOrNo: items[i].value.copyToOtherPartyYesOrNo,
          respondByDate:
            translations.days[dueDate.getDay()] +
            ' ' +
            dueDate.getDate() +
            ' ' +
            translations.months[dueDate.getMonth()] +
            ' ' +
            dueDate.getFullYear(),
          applicationType: applicationTypes.respondent.a.includes(items[i].value.type) ? 'A' : 'B',
          number: items[i].id,
          applicationState: items[i].value.applicationState,
          date: items[i].value.date,
          type: items[i].value.type,
        };
        bannerContent.push(rec);
      }
    }
    return bannerContent;
  }
};

export const populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors = (
  respondentItems: GenericTseApplicationTypeItem[],
  url: string,
  translations: AnyRecord
): GenericTseApplicationTypeItem[] => {
  if (respondentItems?.length) {
    respondentItems.forEach(item => {
      item.value.date = new Date(item.value?.date).toLocaleDateString(retrieveCurrentLocale(url), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      item.linkValue = translations[item.value.type];
      item.redirectUrl = `/respondent-application-details/${item.id}${getLanguageParam(url)}`;

      item.displayStatus = translations[item.value.applicationState];
      item.statusColor = statusColorMap.get(item.value.applicationState as HubLinkStatus);
    });
    return respondentItems;
  }
};

export const getClaimantResponseDocDownload = (selectedApplication: GenericTseApplicationTypeItem): Document => {
  let claimantResponseDocDownload = undefined;
  const selectedAppRespondCollection = selectedApplication.value?.respondCollection;
  for (let i = selectedAppRespondCollection?.length - 1; i >= 0; i--) {
    const selectedAppRespondCollectionItem = selectedAppRespondCollection[i].value;
    if (
      selectedAppRespondCollectionItem.from === Applicant.CLAIMANT &&
      selectedAppRespondCollectionItem.supportingMaterial !== undefined
    ) {
      claimantResponseDocDownload = selectedAppRespondCollectionItem.supportingMaterial[0].value.uploadedDocument;
    }
  }
  return claimantResponseDocDownload;
};

export const setSelectedTseApplication = (
  req: AppRequest<Partial<AnyRecord>>,
  userCase: CaseWithId,
  selectedApplication: GenericTseApplicationTypeItem
): void => {
  const savedApplication = req.session.userCase.selectedGenericTseApplication;

  if (!savedApplication || (savedApplication && req.params.appId !== savedApplication.id)) {
    clearTseFields(userCase);
    req.session.userCase.selectedGenericTseApplication = selectedApplication;
  }
};

export const getResponseDocDownloadLink = (selectedApplication: GenericTseApplicationTypeItem): string => {
  const selectedApplicationRespondCollection = selectedApplication?.value?.respondCollection;
  if (!selectedApplicationRespondCollection?.length) {
    return '';
  }

  const responseDoc = selectedApplicationRespondCollection[0].value?.supportingMaterial?.[0].value.uploadedDocument;

  if (!responseDoc) {
    return '';
  }

  return createDownloadLink(responseDoc);
};

export const getApplicationDocDownloadLink = (selectedApplication: GenericTseApplicationTypeItem): string => {
  const applicationDocDownload = selectedApplication?.value?.documentUpload;

  if (!applicationDocDownload) {
    return '';
  }

  return createDownloadLink(applicationDocDownload);
};

export const getDecisionContent = async (
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord
): Promise<any[] | void> => {
  const selectedAppAdminDecision = selectedApplication.value?.adminDecision;
  let decisionContent = undefined;
  const decisionDocDownload: string | any[] = getDecisionDocDownload(selectedAppAdminDecision);

  const decisionDocDownloadLink = [];
  if (decisionDocDownload.length > 0) {
    for (let i = decisionDocDownload.length - 1; i >= 0; i--) {
      if (decisionDocDownload[i]) {
        decisionDocDownloadLink[i] = createDownloadLink(decisionDocDownload[i]);
      }
    }
    decisionContent = getTseApplicationDecisionDetails(
      selectedApplication.value,
      translations,
      decisionDocDownloadLink
    );
  }

  if (selectedAppAdminDecision?.length) {
    decisionContent = getTseApplicationDecisionDetails(
      selectedApplication.value,
      translations,
      decisionDocDownloadLink
    );
  }

  return decisionContent;
};

export const getDecisionDocDownload = (selectedAppAdminDecision: TseAdminDecisionItem[]): any[] => {
  const decisionDocDownload: string | any[] = [];
  if (selectedAppAdminDecision?.length) {
    for (let i = selectedAppAdminDecision.length - 1; i >= 0; i--) {
      if (selectedAppAdminDecision[i].value?.responseRequiredDoc) {
        decisionDocDownload[i] = selectedAppAdminDecision[i].value.responseRequiredDoc[0].value.uploadedDocument;
      }
    }
  }
  return decisionDocDownload;
};
