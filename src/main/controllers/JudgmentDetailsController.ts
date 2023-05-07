import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { updateDecisionState, updateJudgmentNotificationState } from './helpers/CaseHelpers';
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
import { getApplicationDocDownloadLink, getResponseDocDownloadLink } from './helpers/TseRespondentApplicationHelpers';

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
    let selectedAttachment = undefined;
    let selectedDecisionApplication;
    let responseDocDownloadLink = undefined;
    let selectedApplicationDocDownloadLink = undefined;

    if (selectedJudgment === undefined) {
      decisions = getDecisions(userCase);
      selectedDecision = findSelectedDecision(decisions, req.params.appId);
      if (selectedDecision?.value?.decisionState !== HubLinkStatus.VIEWED) {
        try {
          await updateDecisionState(selectedDecision, req, logger);
        } catch (error) {
          logger.info(error.message);
        }
      }
      selectedDecisionApplication = getApplicationOfDecision(userCase, selectedDecision);
      const accessToken = req.session.user?.accessToken;
      selectedApplicationDocDownloadLink = await getApplicationDocDownloadLink(
        selectedDecisionApplication,
        logger,
        accessToken,
        res
      );
      responseDocDownloadLink = await getResponseDocDownloadLink(selectedDecisionApplication, logger, accessToken, res);
      header = translations.applicationTo + translations[selectedDecisionApplication.value.type];
      selectedAttachment = selectedDecision.value.responseRequiredDoc;
      selectedDecision.value.decisionState = HubLinkStatus.VIEWED;
    } else {
      userCase.selectedRequestOrOrder = selectedJudgment;
      header = selectedJudgment.value.sendNotificationTitle;
      selectedAttachment =
        selectedJudgment.value?.sendNotificationUploadDocument === undefined
          ? undefined
          : selectedJudgment.value?.sendNotificationUploadDocument[0]?.value.uploadedDocument;
      if (selectedJudgment.value.notificationState !== HubLinkStatus.VIEWED) {
        try {
          await updateJudgmentNotificationState(selectedJudgment, req, logger);
        } catch (error) {
          logger.info(error.message);
        }
      }
    }

    const document = selectedAttachment === undefined ? undefined : selectedAttachment;

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
        ? getDecisionDetails(
            userCase,
            selectedDecision,
            selectedApplicationDocDownloadLink,
            responseDocDownloadLink,
            downloadLink,
            translations
          )
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
