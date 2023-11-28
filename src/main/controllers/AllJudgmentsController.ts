import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getPageContent } from './helpers/FormHelpers';
import {
  getDecisions,
  getJudgments,
  populateDecisionItemsWithRedirectLinksCaptionsAndStatusColors,
  populateJudgmentItemsWithRedirectLinksCaptionsAndStatusColors,
} from './helpers/JudgmentHelpers';

export default class AllJudgmentsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;

    let judgments;
    if (userCase?.sendNotificationCollection?.length) {
      judgments = getJudgments(userCase);
    }

    let decisions;
    if (userCase?.genericTseApplicationCollection?.filter(it => it.value.adminDecision?.length)) {
      decisions = getDecisions(userCase);
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.ALL_JUDGMENTS, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    };

    populateJudgmentItemsWithRedirectLinksCaptionsAndStatusColors(judgments, req.url, translations);
    populateDecisionItemsWithRedirectLinksCaptionsAndStatusColors(decisions, req.url, translations);

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.ALL_JUDGMENTS,
    ]);

    res.render(TranslationKeys.ALL_JUDGMENTS, {
      ...content,
      translations,
      judgments,
      decisions,
      welshEnabled,
    });
  };
}
