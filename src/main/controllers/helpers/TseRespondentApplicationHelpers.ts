import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { RESPONDENT } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { RespondentApplicationDetails } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus, statusColorMap } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';

import { getTseApplicationDecisionDetails } from './ApplicationDetailsHelper';
import { clearTseFields } from './CaseHelpers';
import { createDownloadLink, getDocumentAdditionalInformation } from './DocumentHelpers';
import { getLanguageParam } from './RouterHelpers';

export const getRespondentApplications = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  return userCase?.genericTseApplicationCollection?.filter(
    app =>
      app.value.applicant.includes(RESPONDENT) &&
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

export const activateRespondentApplicationsLink = (
  items: GenericTseApplicationTypeItem[],
  userCase: CaseWithId
): void => {
  if (items?.length) {
    userCase.hubLinksStatuses[HubLinkNames.RespondentApplications] = HubLinkStatus.IN_PROGRESS;
  }
};

export const populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors = (
  respondentItems: GenericTseApplicationTypeItem[],
  url: string,
  translations: AnyRecord
): GenericTseApplicationTypeItem[] => {
  if (respondentItems?.length) {
    respondentItems.forEach(item => {
      const app = translations[item.value.type];
      item.linkValue = app;
      item.redirectUrl = `/respondent-application-details/${item.id}${getLanguageParam(url)}`;
      item.statusColor = statusColorMap.get(<HubLinkStatus>item.value.applicationState);
      item.displayStatus = translations[item.value.applicationState];
    });
    return respondentItems;
  }
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

export const getResponseDocDownloadLink = async (
  selectedApplication: GenericTseApplicationTypeItem,
  logger: LoggerInstance,
  accessToken: string,
  res: Response
): Promise<string | void> => {
  let responseDocDownload = undefined;
  let responseDoc = undefined;
  const selectedApplicationRespondCollection = selectedApplication?.value?.respondCollection;
  if (selectedApplicationRespondCollection?.length) {
    responseDoc =
      selectedApplicationRespondCollection[0].value?.supportingMaterial === undefined
        ? undefined
        : selectedApplicationRespondCollection[0].value?.supportingMaterial[0].value.uploadedDocument;
  }
  if (responseDoc !== undefined) {
    try {
      await getDocumentAdditionalInformation(responseDoc, accessToken);
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }
    responseDocDownload = createDownloadLink(responseDoc);
  }
  return responseDocDownload;
};

export const getApplicationDocDownloadLink = async (
  selectedApplication: GenericTseApplicationTypeItem,
  logger: LoggerInstance,
  accessToken: string,
  res: Response
): Promise<string | void> => {
  const applicationDocDownload =
    selectedApplication?.value?.documentUpload === undefined ? undefined : selectedApplication.value.documentUpload;

  if (applicationDocDownload !== undefined) {
    try {
      await getDocumentAdditionalInformation(applicationDocDownload, accessToken);
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }
  }
  return createDownloadLink(applicationDocDownload);
};

export const getDecisionContent = async (
  logger: LoggerInstance,
  selectedApplication: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  accessToken: string,
  res: Response
): Promise<any[] | void> => {
  const selectedAppAdminDecision = selectedApplication.value?.adminDecision;
  let decisionContent = undefined;
  const decisionDocDownload: string | any[] = getDecisionDocDownload(selectedAppAdminDecision);

  const decisionDocDownloadLink = [];
  if (decisionDocDownload.length > 0) {
    for (let i = decisionDocDownload.length - 1; i >= 0; i--) {
      if (decisionDocDownload[i]) {
        try {
          await getDocumentAdditionalInformation(decisionDocDownload[i], accessToken);
        } catch (err) {
          logger.error(err.message);
          return res.redirect('/not-found');
        }
        decisionDocDownloadLink[i] = createDownloadLink(decisionDocDownload[i]);
      }
    }
    decisionContent = getTseApplicationDecisionDetails(selectedApplication, translations, decisionDocDownloadLink);
  }

  if (selectedAppAdminDecision?.length) {
    decisionContent = getTseApplicationDecisionDetails(selectedApplication, translations, decisionDocDownloadLink);
  }

  return decisionContent;
};

export const getDecisionDocDownload = (selectedAppAdminDecision: TseAdminDecisionItem[]): any[] => {
  const decisionDocDownload: string | any[] = [];
  if (selectedAppAdminDecision?.length) {
    for (let i = selectedAppAdminDecision.length - 1; i >= 0; i--) {
      if (selectedAppAdminDecision[i].value.responseRequiredDoc !== undefined) {
        decisionDocDownload[i] = selectedAppAdminDecision[i].value.responseRequiredDoc;
      }
    }
  }
  return decisionDocDownload;
};
