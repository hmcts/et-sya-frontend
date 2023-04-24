import { CaseWithId } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { HubLinkNames, HubLinkStatus, statusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { createDownloadLink } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';

export const activateJudgmentsLink = (
  judgmentItems: SendNotificationTypeItem[],
  decisionItems: TseAdminDecisionItem[],
  userCase: CaseWithId
): void => {
  if ((judgmentItems && judgmentItems.length) || (decisionItems && decisionItems.length)) {
    userCase.hubLinksStatuses[HubLinkNames.TribunalJudgments] = HubLinkStatus.IN_PROGRESS;
  }
};

export const populateJudgmentItemsWithRedirectLinksCaptionsAndStatusColors = (
  judgmentItems: SendNotificationTypeItem[],
  url: string,
  translations: AnyRecord
): SendNotificationTypeItem[] => {
  if (judgmentItems && judgmentItems.length) {
    judgmentItems.forEach(item => {
      item.redirectUrl = `/judgment-details/${item.id}${getLanguageParam(url)}`;
      item.statusColor = statusColorMap.get(<HubLinkStatus>item.value.notificationState);
      item.displayStatus = translations[item.value.notificationState];
    });
    return judgmentItems;
  }
};

export const populateDecisionItemsWithRedirectLinksCaptionsAndStatusColors = (
  decisionItems: TseAdminDecisionItem[],
  url: string,
  translations: AnyRecord
): TseAdminDecisionItem[] => {
  if (decisionItems && decisionItems.length) {
    decisionItems.forEach(item => {
      item.redirectUrl = `/judgment-details/${item.id}${getLanguageParam(url)}`;
      item.statusColor = statusColorMap.get(<HubLinkStatus>item.notificationState);
      item.displayStatus = translations[item.notificationState];
    });
    return decisionItems;
  }
};

export const getJudgmentDetails = (
  selectedJudgment: SendNotificationTypeItem,
  translations: AnyRecord
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  const judgmentDetails = [];

  judgmentDetails.push(
    {
      key: {
        text: translations.decision,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedJudgment.value.sendNotificationDecision,
      },
    },
    {
      key: {
        text: translations.dateSent,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedJudgment.value.date,
      },
    },
    {
      key: {
        text: translations.sentBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedJudgment.value.sendNotificationSentBy,
      },
    }
  );
  if (selectedJudgment.value.sendNotificationAdditionalInfo) {
    judgmentDetails.push({
      key: {
        text: translations.additionalInfo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedJudgment.value.sendNotificationAdditionalInfo,
      },
    });
  }

  if (selectedJudgment.value.sendNotificationUploadDocument) {
    judgmentDetails.push(
      {
        key: {
          text: translations.description,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedJudgment.value.sendNotificationUploadDocument[0].value.shortDescription,
        },
      },
      {
        key: {
          text: translations.document,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          value: {
            html: createDownloadLink(selectedJudgment.value.sendNotificationUploadDocument[0].value.uploadedDocument),
          },
        },
      }
    );
  }
  judgmentDetails.push(
    {
      key: {
        text: translations.judgmentMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedJudgment.value.sendNotificationWhoMadeJudgement,
      },
    },

    {
      key: {
        text: translations.name,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedJudgment.value.sendNotificationFullName2,
      },
    },
    {
      key: {
        text: translations.sentTo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedJudgment.value.sendNotificationNotify,
      },
    }
  );
  return judgmentDetails;
};

export const getDecisions = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  return userCase?.genericTseApplicationCollection
    ?.filter(app => app.value.adminDecision && app.value.adminDecision.length)
    .flatMap(it => it.value.adminDecision);
};

export const getJudgmentDecisions = (items: TseAdminDecisionItem[]): TseAdminDecisionItem[] => {
  return items?.filter(it => it.value.typeOfDecision === 'Judgment');
};

export const getJudgments = (userCase: CaseWithId): SendNotificationTypeItem[] => {
  return userCase?.sendNotificationCollection?.filter(app => app.value.sendNotificationSubjectString === 'Judgment');
};

export const getJudgmentBannerContent = (
  items: SendNotificationTypeItem[],
  languageParam: string
): SendNotificationTypeItem[] => {
  const bannerContent: SendNotificationTypeItem[] = [];

  if (items && items.length) {
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
