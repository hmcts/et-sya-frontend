import { CaseWithId } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { CLAIMANT } from '../../definitions/constants';
import { DecisionBannerDetails } from '../../definitions/definition';
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
  downloadLink: string,
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
          html: downloadLink,
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

export const getDecisionDetails = (
  userCase: CaseWithId,
  selectedDecision: TseAdminDecisionItem,
  downloadLink: string,
  translations: AnyRecord
): { key: unknown; value?: unknown; actions?: unknown }[][] => {
  const selectedDecisionApplication = getApplicationOfDecision(userCase);
  let responseFrom;
  if (selectedDecisionApplication.value.respondCollection?.length) {
    responseFrom =
      selectedDecisionApplication.value.respondCollection[0].value.from === CLAIMANT
        ? translations.responseFromRespondent
        : translations.responseFromClaimant;
  }
  const applicationDetails = [];
  const responseDetails = [];
  const decisionDetails = [];

  applicationDetails.push(
    {
      key: {
        text: translations.applicant,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecisionApplication.value.applicant,
      },
    },
    {
      key: {
        text: translations.applicationType,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecisionApplication.value.type,
      },
    },
    {
      key: {
        text: translations.applicationDate,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecisionApplication.value.date,
      },
    },
    {
      key: {
        text: translations.legend,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecisionApplication.value.details,
      },
    }
  );
  if (selectedDecisionApplication.value.documentUpload) {
    applicationDetails.push(
      {
        key: {
          text: translations.supportingMaterial,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedDecisionApplication.value.documentUpload.document_url,
        },
      },
      {
        key: {
          text: translations.document,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          html: downloadLink,
        },
      }
    );
  }
  applicationDetails.push({
    key: {
      text: translations.copyCorrespondence,
      classes: 'govuk-!-font-weight-regular-m',
    },
    value: {
      text: selectedDecisionApplication.value.copyToOtherPartyYesOrNo,
    },
  });
  if (selectedDecisionApplication.value.respondCollection) {
    responseDetails.push(
      {
        key: {
          text: translations.responseFrom,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedDecisionApplication.value.respondCollection[0].value.from,
        },
      },
      {
        key: {
          text: translations.date,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          html: selectedDecisionApplication.value.respondCollection[0].value.date,
        },
      },
      {
        key: {
          text: translations.responsePart1 + responseFrom + translations.responsePart2,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          html: selectedDecisionApplication.value.respondCollection[0].value.response,
        },
      }
    );
  }
  decisionDetails.push(
    {
      key: {
        text: translations.decision,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision.value.enterNotificationTitle,
      },
    },
    {
      key: {
        text: translations.dateSent,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision.value.date,
      },
    },
    {
      key: {
        text: translations.sentBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision.value.decisionMadeBy,
      },
    }
  );
  if (selectedDecision.value.additionalInformation) {
    decisionDetails.push({
      key: {
        text: translations.additionalInfo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision.value.additionalInformation,
      },
    });
  }

  if (selectedDecision.value.responseRequiredDoc) {
    decisionDetails.push(
      {
        key: {
          text: translations.description,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedDecision.value.responseRequiredDoc.document_url,
        },
      },
      {
        key: {
          text: translations.document,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          html: downloadLink,
        },
      }
    );
  }
  decisionDetails.push(
    {
      key: {
        text: translations.decisionMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision.value.decisionMadeBy,
      },
    },

    {
      key: {
        text: translations.name,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision.value.decisionMadeByFullName,
      },
    },
    {
      key: {
        text: translations.sentTo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision.value.selectPartyNotify,
      },
    }
  );
  return [applicationDetails, responseDetails, decisionDetails];
};

export function getDecisions(userCase: CaseWithId): TseAdminDecisionItem[] {
  const decisions = userCase?.genericTseApplicationCollection
    ?.filter(app => app.value.adminDecision && app.value.adminDecision.length)
    .flatMap(it => it.value.adminDecision);
  return decisions;
}

export function getApplicationOfDecision(userCase: CaseWithId): GenericTseApplicationTypeItem {
  const allApplications = userCase.genericTseApplicationCollection;
  let stack = allApplications.map(item => ({ selectedApplicationId: item.id, selectedApplication: item }));
  while (stack.length) {
    const { selectedApplicationId, selectedApplication } = stack.pop();
    stack = stack.concat(
      selectedApplication.value.adminDecision?.map(item => ({
        selectedApplicationId: selectedApplicationId.concat(item.id),
        selectedApplication: item,
      }))
    );
    return userCase.genericTseApplicationCollection.find(item => item.id === selectedApplicationId);
  }
}

export const getJudgmentDecisions = (items: TseAdminDecisionItem[]): TseAdminDecisionItem[] => {
  return items?.filter(it => it.value.typeOfDecision === 'Judgment');
};

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

export const getDecisionBannerContent = (
  items: GenericTseApplicationTypeItem[],
  translations: AnyRecord,
  languageParam: string
): DecisionBannerDetails[] => {
  const bannerContent: DecisionBannerDetails[] = [];
  if (items && items.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].value.adminDecision?.length) {
        for (let j = items[i].value.adminDecision.length - 1; j >= 0; j--) {
          if (items[i].value.adminDecision[j].value.typeOfDecision === 'Judgment') {
            const decisionBannerHeader =
              items[i].value.applicant === CLAIMANT
                ? translations.notificationBanner.decisionJudgment.headerClaimant + translations[items[i].value.type]
                : translations.notificationBanner.decisionJudgment.headerRespondent + translations[items[i].value.type];
            const bannerDetails: DecisionBannerDetails = {
              decisionBannerHeader,
              redirectUrl: `/judgment-details/${items[i].value.adminDecision[j].id}${languageParam}`,
              applicant: items[i].value.applicant,
              applicationType: items[i].value.type,
            };
            bannerContent.push(bannerDetails);
          }
        }
      }
    }
    return bannerContent;
  }
};
