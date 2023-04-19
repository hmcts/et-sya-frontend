import { CaseWithId } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { HubLinkNames, HubLinkStatus, statusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

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
  translations: AnyRecord,
  downloadLink: string
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  return [
    {
      key: {
        text: translations.decision,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedJudgment.value.date,
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
        text: translations.applicationType,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedJudgment.value.sendNotificationAdditionalInfo,
      },
    },
    {
      key: {
        text: translations.legend,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: selectedJudgment.value.sendNotificationUploadDocument[0].value.shortDescription },
    },
    {
      key: {
        text: translations.supportingMaterial,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { html: downloadLink },
    },
    {
      key: {
        text: translations.judgmentMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: selectedJudgment.value.sendNotificationRequestMadeBy },
    },
    {
      key: {
        text: translations.sentTo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { text: selectedJudgment.value.sendNotificationSelectParties },
    },
  ];
};

export const getDecisions = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  return userCase?.genericTseApplicationCollection
    ?.filter(app => app.value.adminDecision && app.value.adminDecision.length)
    .flatMap(it => it.value.adminDecision);
};
