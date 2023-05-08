import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { CLAIMANT, RESPONDENT } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { DecisionAndApplicationDetails } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus, statusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { getLanguageParam } from './RouterHelpers';

export const activateJudgmentsLink = (
  judgmentItems: SendNotificationTypeItem[],
  decisionItems: TseAdminDecisionItem[],
  req: AppRequest
): void => {
  const userCase = req.session?.userCase;
  if (
    (judgmentItems && judgmentItems?.length && judgmentItems !== undefined) ||
    (decisionItems && decisionItems?.length && decisionItems !== undefined)
  ) {
    if (userCase.hubLinksStatuses[HubLinkNames.tribunalJudgements] === HubLinkStatus.NOT_YET_AVAILABLE) {
      userCase.hubLinksStatuses[HubLinkNames.tribunalJudgements] = HubLinkStatus.IN_PROGRESS;
    }
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
  selectedApplicationDocDownloadLink: string | void,
  selectedApplicationResponseDocDownloadLink: string | void,
  downloadLink: string,
  translations: AnyRecord
): { key: unknown; value?: unknown; actions?: unknown }[][] => {
  const selectedDecisionApplication = getApplicationOfDecision(userCase, selectedDecision);
  let responseFrom;
  if (selectedDecisionApplication?.value.respondCollection?.length) {
    responseFrom =
      selectedDecisionApplication?.value.respondCollection[0].value.from === CLAIMANT
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
        text: selectedDecisionApplication?.value.applicant,
      },
    },
    {
      key: {
        text: translations.applicationType,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecisionApplication?.value.type,
      },
    },
    {
      key: {
        text: translations.applicationDate,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecisionApplication?.value.date,
      },
    },
    {
      key: {
        text: translations.legend,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecisionApplication?.value.details,
      },
    }
  );
  if (selectedDecisionApplication?.value.documentUpload) {
    applicationDetails.push({
      key: {
        text: translations.supportingMaterial,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        html: selectedApplicationDocDownloadLink,
      },
    });
  }
  applicationDetails.push({
    key: {
      text: translations.copyCorrespondence,
      classes: 'govuk-!-font-weight-regular-m',
    },
    value: {
      text: selectedDecisionApplication?.value.copyToOtherPartyYesOrNo,
    },
  });
  if (selectedDecisionApplication?.value.respondCollection) {
    responseDetails.push(
      {
        key: {
          text: translations.responseFrom,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: selectedDecisionApplication?.value.respondCollection[0].value.from,
        },
      },
      {
        key: {
          text: translations.date,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          html: selectedDecisionApplication?.value.respondCollection[0].value.date,
        },
      },
      {
        key: {
          text: translations.responsePart1 + responseFrom + translations.responsePart2,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          html: selectedDecisionApplication?.value.respondCollection[0].value.response,
        },
      }
    );
    if (selectedDecisionApplication?.value.respondCollection[0].value.supportingMaterial) {
      responseDetails.push({
        key: {
          text: translations.supportingMaterial,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          html: selectedApplicationResponseDocDownloadLink,
        },
      });
    }
    responseDetails.push({
      key: {
        text: translations.copyCorrespondence,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecisionApplication?.value.copyToOtherPartyYesOrNo,
      },
    });
  }
  decisionDetails.push(
    {
      key: {
        text: translations.decision,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision?.value.enterNotificationTitle,
      },
    },
    {
      key: {
        text: translations.dateSent,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision?.value.date,
      },
    },
    {
      key: {
        text: translations.sentBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision?.value.decisionMadeBy,
      },
    }
  );
  if (selectedDecision?.value.additionalInformation) {
    decisionDetails.push({
      key: {
        text: translations.additionalInfo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision?.value.additionalInformation,
      },
    });
  }

  if (selectedDecision?.value.responseRequiredDoc) {
    decisionDetails.push({
      key: {
        text: translations.document,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        html: downloadLink,
      },
    });
  }
  decisionDetails.push(
    {
      key: {
        text: translations.decisionMadeBy,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision?.value.decisionMadeBy,
      },
    },

    {
      key: {
        text: translations.name,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision?.value.decisionMadeByFullName,
      },
    },
    {
      key: {
        text: translations.sentTo,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedDecision?.value.selectPartyNotify,
      },
    }
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
  if (decisionItems && decisionItems.length) {
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
  const decisions = userCase?.genericTseApplicationCollection.filter(obj => obj.value.adminDecision?.length);
  return decisions;
}

export function matchDecisionsToApps(
  appOfDecision: GenericTseApplicationTypeItem[],
  decision: TseAdminDecisionItem[]
): DecisionAndApplicationDetails[] {
  const result = [];
  if (appOfDecision?.length) {
    for (let i = 0; i < appOfDecision.length; i++) {
      if (
        (appOfDecision[i].value.applicant === RESPONDENT &&
          !appOfDecision[i].value.type.includes(applicationTypes.respondent.c) &&
          appOfDecision[i].value.copyToOtherPartyYesOrNo === YesOrNo.YES) ||
        appOfDecision[i].value.applicant === CLAIMANT
      ) {
        const parent = appOfDecision[i];
        for (let j = 0; j < parent.value.adminDecision.length; j++) {
          if (parent.value.adminDecision[j].value.typeOfDecision === 'Judgment') {
            const nested = parent.value.adminDecision[j];
            const matchingChildren = decision.filter(child => child.id === nested.id);
            result.push({
              ...parent,
              decisionOfApp: matchingChildren[0],
            });
          }
        }
      }
    }
  }
  return result;
}

export function getApplicationOfDecision(
  userCase: CaseWithId,
  selectedDecision: TseAdminDecisionItem
): GenericTseApplicationTypeItem {
  const data = userCase?.genericTseApplicationCollection;
  const decisionApps = data?.filter(element => element.value.adminDecision && element.value.adminDecision.length);
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
  return userCase?.sendNotificationCollection?.filter(app =>
    app.value.sendNotificationSubjectString.includes('Judgment')
  );
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
  appsAndDecisions: DecisionAndApplicationDetails[],
  translations: AnyRecord,
  languageParam: string
): DecisionAndApplicationDetails[] => {
  const items = appsAndDecisions;
  const bannerContent: DecisionAndApplicationDetails[] = [];
  if (items && items.length) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].decisionOfApp?.value?.decisionState !== HubLinkStatus.VIEWED) {
        const decisionBannerHeader =
          items[i].value.applicant === CLAIMANT
            ? translations.notificationBanner.decisionJudgment.headerClaimant + translations[items[i].value.type]
            : translations.notificationBanner.decisionJudgment.headerRespondent + translations[items[i].value.type];
        const bannerDetails: DecisionAndApplicationDetails = {
          decisionBannerHeader,
          redirectUrl: `/judgment-details/${items[i].decisionOfApp?.id}${languageParam}`,
          applicant: items[i].value.applicant,
          applicationType: items[i].value.type,
        };
        bannerContent.push(bannerDetails);
      }
    }
    return bannerContent;
  }
};
