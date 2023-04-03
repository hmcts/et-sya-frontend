import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CLAIMANT, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { updateSendNotificationState } from './helpers/CaseHelpers';
import { getDocumentAdditionalInformation } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getRepondentOrderOrRequestDetails } from './helpers/TribunalOrderOrRequestHelper';

const logger = getLogger('TribunalOrderOrRequestDetailsController');
export default class TribunalOrderOrRequestDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const selectedRequestOrOrder = userCase.sendNotificationCollection.find(it => it.id === req.params.orderId);

    userCase.selectedRequestOrOrder = selectedRequestOrOrder;

    try {
      await updateSendNotificationState(req, logger);
    } catch (error) {
      logger.info(error.message);
    }

    //todo URL must be reviewed and changed to 'Respond to request'.
    const redirectUrl = '';
    const respondButton = !selectedRequestOrOrder.value.respondCollection?.some(r => r.value.from === CLAIMANT);
    const documents = selectedRequestOrOrder.value.sendNotificationUploadDocument;
    if (documents && documents.length) {
      for (const it of documents) {
        try {
          await getDocumentAdditionalInformation(it.value.uploadedDocument, req.session.user?.accessToken);
        } catch (err) {
          logger.error(err.message);
          res.redirect('/not-found');
        }
      }
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS,
    ]);

    res.render(TranslationKeys.TRIBUNAL_ORDER_OR_REQUEST_DETAILS, {
      ...content,
      respondButton,
      orderOrRequestContent: getRepondentOrderOrRequestDetails(translations, selectedRequestOrOrder),
      redirectUrl,
      header: selectedRequestOrOrder.value.sendNotificationTitle,
    });
  };
}
