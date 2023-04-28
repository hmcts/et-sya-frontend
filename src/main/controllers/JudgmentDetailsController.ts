import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { updateJudgmentNotificationState } from './helpers/CaseHelpers';
import { createDownloadLink, getDocumentAdditionalInformation } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import {
  findSelectedDecision,
  findSelectedJudgment,
  getApplicationOfDecision,
  getDecisionDetails,
  getDecisions,
  getJudgmentDetails,
} from './helpers/JudgmentHelpers';

const logger = getLogger('JudgmentDetailsController');
export default class JudgmentDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    req.session.documentDownloadPage = PageUrls.JUDGMENT_DETAILS;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.JUDGMENT_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const selectedJudgment = findSelectedJudgment(userCase.sendNotificationCollection, req.params.appId);
    let selectedDecision = undefined;
    let decisions = undefined;
    let header = undefined;
    let selectedJudgmentAttachment = undefined;
    let selectedDecisionApplication;

    if (selectedJudgment === undefined) {
      decisions = getDecisions(userCase);
      selectedDecision = findSelectedDecision(decisions, req.params.appId);
      selectedDecisionApplication = getApplicationOfDecision(userCase);
      header = translations.applicationTo + translations[selectedDecisionApplication.value.type];
      selectedJudgmentAttachment = selectedDecision.value.responseRequiredDoc;
      selectedDecision.notificationState = HubLinkStatus.VIEWED;
    } else {
      selectedJudgment.value.notificationState = HubLinkStatus.VIEWED;
      header = selectedJudgment.value.sendNotificationTitle;
      selectedJudgmentAttachment =
        selectedJudgment.value?.sendNotificationUploadDocument === undefined
          ? undefined
          : selectedJudgment.value?.sendNotificationUploadDocument[0]?.value.uploadedDocument;
      if (selectedJudgment.value.notificationState !== HubLinkStatus.VIEWED) {
        try {
          await updateJudgmentNotificationState(selectedJudgment, req, logger);
          selectedJudgment.value.notificationState = HubLinkStatus.VIEWED;
        } catch (error) {
          logger.info(error.message);
        }
      }
    }

    const document = selectedJudgmentAttachment === undefined ? undefined : selectedJudgmentAttachment;

    if (document) {
      try {
        await getDocumentAdditionalInformation(document, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect('/not-found');
      }
    }

    const downloadLink = createDownloadLink(document);
    const pageContent =
      selectedJudgment === undefined
        ? getDecisionDetails(userCase, selectedDecision, downloadLink, translations)
        : getJudgmentDetails(selectedJudgment, downloadLink, translations);

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.JUDGMENT_DETAILS,
    ]);

    res.render(TranslationKeys.JUDGMENT_DETAILS, {
      ...content,
      header,
      selectedJudgment,
      selectedDecision,
      pageContent,
      selectedDecisionApplication,
    });
  };
}
