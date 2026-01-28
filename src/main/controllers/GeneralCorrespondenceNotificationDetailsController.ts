import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { updateSendNotificationState } from './helpers/CaseHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getCorrespondenceNotificationDetails } from './helpers/GeneralCorrespondenceHelper';

const logger = getLogger('GeneralCorrespondenceNotificationDetailsController');
export default class GeneralCorrespondenceNotificationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const selectedCorrespondence = userCase.sendNotificationCollection.find(it => it.id === req.params.itemId);
    userCase.selectedRequestOrOrder = selectedCorrespondence;
    if (selectedCorrespondence.value.notificationState === HubLinkStatus.NOT_VIEWED) {
      try {
        selectedCorrespondence.value.notificationState = HubLinkStatus.VIEWED;
        await updateSendNotificationState(req, logger);
      } catch (error) {
        logger.info(error.message);
      }
    }
    req.session.documentDownloadPage = PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.NOTIFICATION_SUBJECTS, { returnObjects: true }),
      ...req.t(TranslationKeys.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.NOTIFICATION_SUBJECTS,
      TranslationKeys.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS,
    ]);
    const welshEnabled = await getFlagValue('welsh-language', null);
    res.render(TranslationKeys.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS, {
      ...content,
      correspondenceContent: getCorrespondenceNotificationDetails(translations, selectedCorrespondence, req.url),
      welshEnabled,
    });
  };
}
