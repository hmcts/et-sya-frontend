import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
} from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { updateDecisionState, updateJudgmentNotificationState } from './helpers/CaseHelpers';
import { getPageContent } from './helpers/FormHelpers';
import {
  findSelectedDecision,
  findSelectedJudgment,
  getApplicationOfDecision,
  getDecisionAttachments,
  getDecisionDetails,
  getDecisions,
  getJudgmentAttachments,
  getJudgmentDetails,
} from './helpers/JudgmentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getApplicationDocDownloadLink, getResponseDocDownloadLink } from './helpers/TseRespondentApplicationHelpers';

const logger = getLogger('JudgmentDetailsController');
export default class JudgmentDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const languageParam = getLanguageParam(req.url);
    req.session.documentDownloadPage = PageUrls.JUDGMENT_DETAILS;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.JUDGMENT_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    let selectedDecision: TseAdminDecisionItem;
    let header: string;
    let selectedDecisionApplication: GenericTseApplicationTypeItem;
    let pageContent;

    let selectedJudgment: SendNotificationTypeItem;
    if (userCase?.sendNotificationCollection?.length) {
      selectedJudgment = findSelectedJudgment(userCase.sendNotificationCollection, req.params.appId);
    }

    if (selectedJudgment === undefined) {
      let decisions: TseAdminDecisionItem[];
      if (userCase?.genericTseApplicationCollection?.filter(it => it.value.adminDecision?.length)) {
        decisions = getDecisions(userCase);
      }
      selectedDecision = findSelectedDecision(decisions, req.params.appId);
      selectedDecisionApplication = getApplicationOfDecision(userCase, selectedDecision);
      if (selectedDecision.value?.decisionState !== HubLinkStatus.VIEWED) {
        await updateDecisionState(selectedDecisionApplication.id, selectedDecision, req, logger);
      }
      const accessToken = req.session.user?.accessToken;
      let selectedApplicationDocDownloadLink;

      try {
        selectedApplicationDocDownloadLink = await getApplicationDocDownloadLink(
          selectedDecisionApplication,
          accessToken
        );
      } catch (e) {
        logger.error(e.message);
        return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
      }

      let responseDocDownloadLink;

      try {
        responseDocDownloadLink = await getResponseDocDownloadLink(selectedDecisionApplication, accessToken);
      } catch (e) {
        logger.error(e.message);
        res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
      }

      header = translations.applicationTo + translations[selectedDecisionApplication?.value?.type];

      let decisionAttachments;
      try {
        decisionAttachments = await getDecisionAttachments(selectedDecision, req);
      } catch (e) {
        logger.error(e.message);
        res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
      }

      pageContent = getDecisionDetails(
        userCase,
        selectedDecision,
        selectedApplicationDocDownloadLink,
        responseDocDownloadLink,
        decisionAttachments,
        translations
      );
    } else {
      userCase.selectedRequestOrOrder = selectedJudgment;
      header = selectedJudgment.value.sendNotificationTitle;
      if (selectedJudgment.value.notificationState !== HubLinkStatus.VIEWED) {
        try {
          await updateJudgmentNotificationState(selectedJudgment, req, logger);
        } catch (error) {
          logger.info(error.message);
        }
      }
      const judgmentAttachments = await getJudgmentAttachments(selectedJudgment, req, res);
      pageContent = getJudgmentDetails(selectedJudgment.value, judgmentAttachments, translations);
    }

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
