import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { DocumentTypeItem } from '../../definitions/complexTypes/documentTypeItem';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { DecisionAndApplicationDetails } from '../../definitions/definition';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { HubLinkNames, HubLinkStatus, statusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';
import { datesStringToDateInLocale } from '../../helper/dateInLocale';

import { createDownloadLink } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';

export const activateJudgmentsLink = (
  judgmentItems: SendNotificationTypeItem[],
  decisionItems: TseAdminDecisionItem[],
  req: AppRequest
): void => {
  const userCase = req.session?.userCase;
  if (judgmentItems?.length || decisionItems?.length) {
    if (userCase.hubLinksStatuses[HubLinkNames.TribunalJudgements] === HubLinkStatus.NOT_YET_AVAILABLE) {
      userCase.hubLinksStatuses[HubLinkNames.TribunalJudgements] = HubLinkStatus.IN_PROGRESS;
    }
  }
};

export const populateJudgmentItemsWithRedirectLinksCaptionsAndStatusColors = (
  judgmentItems: SendNotificationTypeItem[],
  url: string,
  translations: AnyRecord
): SendNotificationTypeItem[] => {
  if (judgmentItems?.length) {
    judgmentItems.forEach(item => {
      item.redirectUrl = `/judgment-details/${item.id}${getLanguageParam(url)}`;
      if (item.value.notificationState === undefined) {
        item.statusColor = statusColorMap.get(HubLinkStatus.NOT_VIEWED);
        item.displayStatus = translations.notViewedYet;
      } else {
        item.statusColor = statusColorMap.get(<HubLinkStatus>item.value.notificationState);
        item.displayStatus = translations[item.value.notificationState];
      }
    });
    return judgmentItems;
  }
};

export const getJudgmentAttachments = (selectedJudgment: SendNotificationTypeItem): DocumentTypeItem[] => {
  const judgmentAttachments = [];
  if (selectedJudgment?.value?.sendNotificationUploadDocument) {
    for (let i = 0; i < selectedJudgment?.value?.sendNotificationUploadDocument?.length; i++) {
      if (selectedJudgment?.value?.sendNotificationUploadDocument[i]?.value?.uploadedDocument) {
        judgmentAttachments[i] = selectedJudgment?.value?.sendNotificationUploadDocument[i];
      }
    }

    if (judgmentAttachments.length) {
      judgmentAttachments.forEach(it => {
        // Set shortDescription if not already set
        if (!it.value?.shortDescription && it.value?.typeOfDocument) {
          it.value.shortDescription = it.value.typeOfDocument;
        }
        it.downloadLink = createDownloadLink(it.value.uploadedDocument);
      });
    }
  }
  return judgmentAttachments;
};

export const getDecisionAttachments = (selectedDecision: TseAdminDecisionItem): DocumentTypeItem[] => {
  const decisionAttachments = [];
  for (let i = 0; i < selectedDecision?.value?.responseRequiredDoc?.length; i++) {
    if (selectedDecision?.value?.responseRequiredDoc[i]?.value?.uploadedDocument) {
      decisionAttachments[i] = selectedDecision?.value?.responseRequiredDoc[i];
    }
  }

  if (decisionAttachments.length) {
    decisionAttachments.forEach(it => {
      // Set shortDescription if not already set
      if (!it.value?.shortDescription && it.value?.typeOfDocument) {
        it.value.shortDescription = it.value.typeOfDocument;
      }
      it.downloadLink = createDownloadLink(it.value.uploadedDocument);
    });
  }
  return decisionAttachments;
};

export const getJudgmentDetails = (
  selectedJudgment: SendNotificationTypeItem,
  judgmentAttachments: DocumentTypeItem[],
  translations: AnyRecord,
  url: string
): SummaryListRow[] => {
  const judgmentDetails = [];

  judgmentDetails.push(
    addSummaryRow(translations.decision, translations[selectedJudgment.value.sendNotificationDecision]),
    addSummaryRow(translations.dateSent, datesStringToDateInLocale(selectedJudgment.value.date, url)),
    addSummaryRow(translations.sentBy, translations[selectedJudgment.value.sendNotificationSentBy])
  );

  if (selectedJudgment.value.sendNotificationAdditionalInfo) {
    judgmentDetails.push(
      addSummaryRow(translations.additionalInfo, selectedJudgment.value.sendNotificationAdditionalInfo)
    );
  }

  if (judgmentAttachments) {
    for (const element of judgmentAttachments) {
      judgmentDetails.push(
        addSummaryRow(translations.description, element.value.shortDescription),
        addSummaryHtmlRow(translations.document, element.downloadLink)
      );
    }
  }

  judgmentDetails.push(
    addSummaryRow(translations.judgmentMadeBy, translations[selectedJudgment.value.sendNotificationWhoMadeJudgement]),
    addSummaryRow(translations.name, selectedJudgment.value.sendNotificationFullName2),
    addSummaryRow(translations.sentTo, translations[selectedJudgment.value.sendNotificationNotify])
  );
  return judgmentDetails;
};

export const getDecisionDetails = (
  userCase: CaseWithId,
  selectedDecision: TseAdminDecisionItem,
  selectedApplicationDocDownloadLink: string,
  selectedApplicationResponseDocDownloadLink: string,
  selectedAttachments: DocumentTypeItem[],
  translations: AnyRecord
): SummaryListRow[][] => {
  const selectedDecisionApplication = getApplicationOfDecision(userCase, selectedDecision);
  const respond = selectedDecisionApplication?.value.respondCollection[0].value;

  let responseFrom;
  if (selectedDecisionApplication?.value.respondCollection?.length) {
    responseFrom =
      respond.from === Applicant.CLAIMANT ? translations.responseFromRespondent : translations.responseFromClaimant;
  }
  const applicationDetails: SummaryListRow[] = [];
  const responseDetails: SummaryListRow[] = [];
  const decisionDetails: SummaryListRow[] = [];

  applicationDetails.push(
    addSummaryRow(translations.applicant, selectedDecisionApplication?.value.applicant),
    addSummaryRow(translations.applicationType, selectedDecisionApplication?.value.type),
    addSummaryRow(translations.applicationDate, selectedDecisionApplication?.value.date),
    addSummaryRow(translations.legend, selectedDecisionApplication?.value.details)
  );

  if (selectedDecisionApplication?.value.documentUpload) {
    applicationDetails.push(addSummaryHtmlRow(translations.supportingMaterial, selectedApplicationDocDownloadLink));
  }

  applicationDetails.push(
    addSummaryRow(translations.copyCorrespondence, selectedDecisionApplication?.value.copyToOtherPartyYesOrNo)
  );

  if (selectedDecisionApplication?.value.respondCollection) {
    responseDetails.push(
      addSummaryRow(translations.responseFrom, respond.from),
      addSummaryHtmlRow(translations.date, respond.date),
      addSummaryHtmlRow(translations.responsePart1 + responseFrom + translations.responsePart2, respond.response)
    );

    if (respond.supportingMaterial) {
      responseDetails.push(
        addSummaryHtmlRow(translations.supportingMaterial, selectedApplicationResponseDocDownloadLink)
      );
    }

    responseDetails.push(
      addSummaryRow(translations.copyCorrespondence, selectedDecisionApplication?.value.copyToOtherPartyYesOrNo)
    );
  }

  decisionDetails.push(
    addSummaryRow(translations.decision, selectedDecision?.value.enterNotificationTitle),
    addSummaryRow(translations.dateSent, selectedDecision?.value.date),
    addSummaryRow(translations.sentBy, selectedDecision?.value.decisionMadeBy)
  );

  if (selectedDecision?.value.additionalInformation) {
    decisionDetails.push(addSummaryRow(translations.additionalInfo, selectedDecision?.value.additionalInformation));
  }

  if (selectedAttachments) {
    for (const element of selectedAttachments) {
      decisionDetails.push(
        addSummaryHtmlRow(translations.description, element.value.shortDescription),
        addSummaryHtmlRow(translations.document, element.downloadLink)
      );
    }
  }
  decisionDetails.push(
    addSummaryRow(translations.decisionMadeBy, selectedDecision?.value.decisionMadeBy),
    addSummaryRow(translations.name, selectedDecision?.value.decisionMadeByFullName),
    addSummaryRow(translations.sentTo, selectedDecision?.value.selectPartyNotify)
  );
  return [applicationDetails, responseDetails, decisionDetails];
};

export function getDecisions(userCase: CaseWithId): TseAdminDecisionItem[] {
  const decisions = userCase?.genericTseApplicationCollection
    .filter(
      obj =>
        !obj.value.type.includes(applicationTypes.respondent.c) &&
        obj.value.copyToOtherPartyYesOrNo === YesOrNo.YES &&
        obj.value.adminDecision?.length
    )
    .flatMap(obj => obj.value.adminDecision);
  return decisions.filter(it => it.value.typeOfDecision === 'Judgment');
}

export const populateDecisionItemsWithRedirectLinksCaptionsAndStatusColors = (
  decisionItems: TseAdminDecisionItem[],
  url: string,
  translations: AnyRecord
): TseAdminDecisionItem[] => {
  if (decisionItems?.length) {
    decisionItems.forEach(item => {
      item.redirectUrl = `/judgment-details/${item.id}${getLanguageParam(url)}`;
      if (item.value.decisionState === undefined) {
        item.statusColor = statusColorMap.get(HubLinkStatus.NOT_VIEWED);
        item.displayStatus = translations.notViewedYet;
      } else {
        item.statusColor = statusColorMap.get(<HubLinkStatus>item.value.decisionState);
        item.displayStatus = translations[item.value.decisionState];
      }
    });
    return decisionItems;
  }
};

export function getAllAppsWithDecisions(userCase: CaseWithId): GenericTseApplicationTypeItem[] {
  return userCase?.genericTseApplicationCollection.filter(obj => obj.value.adminDecision?.length);
}

export function getApplicationOfDecision(
  userCase: CaseWithId,
  selectedDecision: TseAdminDecisionItem
): GenericTseApplicationTypeItem {
  const data = userCase?.genericTseApplicationCollection;
  const decisionApps = data?.filter(element => element.value.adminDecision?.length);
  const searchValue = selectedDecision;
  let appOfDecision = undefined;

  for (let i = 0; i < decisionApps?.length; i++) {
    if (decisionApps[i].value.adminDecision.find(val => val === searchValue)) {
      appOfDecision = decisionApps[i];
    }
  }
  return appOfDecision;
}

export const findSelectedDecision = (items: TseAdminDecisionItem[], param: string): TseAdminDecisionItem => {
  return items?.find(it => it.id === param);
};

export const getJudgments = (userCase: CaseWithId): SendNotificationTypeItem[] => {
  return userCase?.sendNotificationCollection?.filter(app => app.value.sendNotificationSubjectString === 'Judgment');
};

export const findSelectedJudgment = (items: SendNotificationTypeItem[], param: string): SendNotificationTypeItem => {
  return items?.find(it => it.id === param);
};

export const getJudgmentBannerContent = (
  items: SendNotificationTypeItem[],
  languageParam: string
): SendNotificationTypeItem[] => {
  const bannerContent: SendNotificationTypeItem[] = [];

  if (items?.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].value.notificationState !== HubLinkStatus.VIEWED) {
        const rec: SendNotificationTypeItem = {
          redirectUrl: `/judgment-details/${items[i].id}${languageParam}`,
        };
        bannerContent.push(rec);
      }
    }
    return bannerContent;
  }
};

export const getDecisionBannerContent = (
  appsWithDecisions: GenericTseApplicationTypeItem[],
  translations: AnyRecord,
  languageParam: string
): DecisionAndApplicationDetails[] => {
  const bannerContent: DecisionAndApplicationDetails[] = [];
  if (appsWithDecisions?.length) {
    for (const app of appsWithDecisions) {
      for (const decision of app.value.adminDecision) {
        if (decision.value.decisionState !== HubLinkStatus.VIEWED) {
          const decisionBannerHeader =
            app.value.applicant === Applicant.CLAIMANT
              ? translations.notificationBanner.decisionJudgment.headerClaimant + translations[app.value.type]
              : translations.notificationBanner.decisionJudgment.headerRespondent + translations[app.value.type];

          const bannerDetails: DecisionAndApplicationDetails = {
            decisionBannerHeader,
            redirectUrl: `/judgment-details/${decision?.id}${languageParam}`,
            applicant: app.value.applicant,
            applicationType: app.value.type,
          };
          bannerContent.push(bannerDetails);
        }
      }
    }
    return bannerContent;
  }
};
