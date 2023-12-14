import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { Applicant, PageUrls, Parties, ResponseRequired, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { updateSendNotificationState as setNotificationStateAsViewed } from './helpers/CaseHelpers';
import { getDocumentsAdditionalInformation } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getNotificationResponses, getTribunalOrderOrRequestDetails } from './helpers/TribunalOrderOrRequestHelper';

const logger = getLogger('TribunalOrderOrRequestDetailsController');
export default class TribunalOrderOrRequestDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session.userCase;
    const selectedRequestOrOrder = userCase.sendNotificationCollection.find(it => it.id === req.params.orderId);
    req.session.documentDownloadPage = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS;

    userCase.selectedRequestOrOrder = selectedRequestOrOrder;

    if (selectedRequestOrOrder.value.notificationState === HubLinkStatus.NOT_VIEWED) {
      try {
        await setNotificationStateAsViewed(req, logger);
      } catch (error) {
        logger.info(error.message);
      }
    }

    const redirectUrl =
      PageUrls.TRIBUNAL_RESPOND_TO_ORDER.replace(':orderId', req.params.orderId) + getLanguageParam(req.url);

    const respondButton =
      !selectedRequestOrOrder.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT) &&
      selectedRequestOrOrder.value.sendNotificationResponseTribunal === ResponseRequired.YES &&
      selectedRequestOrOrder.value.sendNotificationSelectParties !== Parties.RESPONDENT_ONLY;

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
      ...req.t(TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS,
    ]);

    const responses = await getNotificationResponses(selectedRequestOrOrder.value, translations, req);

    res.render(TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS, {
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
