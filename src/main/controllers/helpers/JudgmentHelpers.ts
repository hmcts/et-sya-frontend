import logger from '@pact-foundation/pact/src/common/logger';
import { Response } from 'express';

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
import { HubLinkNames, HubLinkStatus, statusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { createDownloadLink, getDocumentsAdditionalInformation } from './DocumentHelpers';
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

export const getJudgmentAttachments = async (
  selectedJudgment: SendNotificationTypeItem,
  req: AppRequest,
  res: Response
): Promise<DocumentTypeItem[]> => {
  const judgmentAttachments = [];
  if (selectedJudgment?.value?.sendNotificationUploadDocument) {
    for (let i = 0; i < selectedJudgment?.value?.sendNotificationUploadDocument?.length; i++) {
      if (selectedJudgment?.value?.sendNotificationUploadDocument[i]?.value?.uploadedDocument) {
        judgmentAttachments[i] = selectedJudgment?.value?.sendNotificationUploadDocument[i];
      }
    }

    if (judgmentAttachments.length) {
      try {
        await getDocumentsAdditionalInformation(judgmentAttachments, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        res.redirect('/not-found');
      }
      judgmentAttachments.forEach(it => (it.downloadLink = createDownloadLink(it.value.uploadedDocument)));
    }
  }
  return judgmentAttachments;
};

export const getDecisionAttachments = async (
  selectedDecision: TseAdminDecisionItem,
  req: AppRequest
): Promise<DocumentTypeItem[]> => {
  const decisionAttachments = [];
  for (let i = 0; i < selectedDecision?.value?.responseRequiredDoc?.length; i++) {
    if (selectedDecision?.value?.responseRequiredDoc[i]?.value?.uploadedDocument) {
      decisionAttachments[i] = selectedDecision?.value?.responseRequiredDoc[i];
    }
  }

  if (decisionAttachments.length) {
    await getDocumentsAdditionalInformation(decisionAttachments, req.session.user?.accessToken);
    decisionAttachments.forEach(it => (it.downloadLink = createDownloadLink(it.value.uploadedDocument)));
  }
  return decisionAttachments;
};

export const getJudgmentDetails = (
  selectedJudgment: SendNotificationTypeItem,
  judgmentAttachments: DocumentTypeItem[],
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

  if (judgmentAttachments) {
    for (const element of judgmentAttachments) {
      judgmentDetails.push(
        {
          key: {
            text: translations.description,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: {
            text: element.value.shortDescription,
          },
        },
        {
          key: {
            text: translations.document,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: {
            html: element.downloadLink,
          },
        }
      );
    }
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
  selectedAttachments: DocumentTypeItem[],
  translations: AnyRecord
): { key: unknown; value?: unknown; actions?: unknown }[][] => {
  const selectedDecisionApplication = getApplicationOfDecision(userCase, selectedDecision);
  let responseFrom;
  if (selectedDecisionApplication?.value.respondCollection?.length) {
    responseFrom =
      selectedDecisionApplication?.value.respondCollection[0].value.from === Applicant.CLAIMANT
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

  if (selectedAttachments) {
    for (const element of selectedAttachments) {
      decisionDetails.push(
        {
          key: {
            text: translations.description,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: {
            html: element.value.shortDescription,
          },
        },
        {
          key: {
            text: translations.document,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: {
            html: element.downloadLink,
          },
        }
      );
    }
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
