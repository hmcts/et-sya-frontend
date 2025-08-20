import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { updateSendNotificationState } from './helpers/CaseHelpers';
import { getDocumentsAdditionalInformation } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { findSelectedSendNotification } from './helpers/StoredToSubmitHelpers';
import {
  anyResponseRequired,
  getNotificationResponses,
  getTribunalOrderOrRequestDetails,
} from './helpers/TribunalOrderOrRequestDetailsHelper';

const logger = getLogger('TribunalOrderOrRequestDetailsController');
export default class TribunalOrderOrRequestDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session.userCase;
    const selectedRequestOrOrder = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.orderId
    );
    req.session.documentDownloadPage = PageUrls.NOTIFICATION_DETAILS;

    userCase.selectedRequestOrOrder = selectedRequestOrOrder;

    try {
      await updateSendNotificationState(req, logger);
    } catch (error) {
      logger.info(error.message);
    }

    const redirectUrl =
      PageUrls.TRIBUNAL_RESPOND_TO_ORDER.replace(':orderId', req.params.orderId) + getLanguageParam(req.url);

    const respondButton = anyResponseRequired(selectedRequestOrOrder);

    try {
      await getDocumentsAdditionalInformation(
        selectedRequestOrOrder.value.sendNotificationUploadDocument,
        req.session.user?.accessToken
      );
    } catch (err) {
      logger.error(err.message);
      res.redirect('/not-found');
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.NOTIFICATION_SUBJECTS, { returnObjects: true }),
      ...req.t(TranslationKeys.NOTIFICATION_DETAILS, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.NOTIFICATION_SUBJECTS,
      TranslationKeys.NOTIFICATION_DETAILS,
    ]);

    const responses = await getNotificationResponses(selectedRequestOrOrder.value, translations, req);

    res.render(TranslationKeys.NOTIFICATION_DETAILS, {
      ...content,
      respondButton,
      orderOrRequestContent: getTribunalOrderOrRequestDetails(translations, selectedRequestOrOrder, req.url),
      redirectUrl,
      header: selectedRequestOrOrder.value.sendNotificationTitle,
      welshEnabled,
      responses,
    });
  };
}
