import logger from '@pact-foundation/pact/src/common/logger';
import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getDocumentAdditionalInformation } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getRepondentOrderOrRequestDetails } from './helpers/RespondentOrderOrRequestHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class RespondentOrderOrRequestDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const selectedRequestOrOrder = userCase.sendNotificationCollection.find(
      it => it.value.number === req.params.orderId
    );

    userCase.selectedRequestOrOrder = selectedRequestOrOrder;

    //todo URL must be reviewed and changed to 'Respond to request'.
    const redirectUrl = `/respondent-order-or-request-details/${selectedRequestOrOrder.value.number}${getLanguageParam(
      req.url
    )}`;
    let respondButton = true;
    if (selectedRequestOrOrder.value.respondCollection?.filter(r => r.value.from === 'Claimant').length > 0) {
      respondButton = false;
    }
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
      ...req.t(TranslationKeys.RESPONDENT_ORDER_OR_REQUEST_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPONDENT_ORDER_OR_REQUEST_DETAILS,
    ]);

    res.render(TranslationKeys.RESPONDENT_ORDER_OR_REQUEST_DETAILS, {
      ...content,
      respondButton,
      orderOrRequestContent: getRepondentOrderOrRequestDetails(translations, selectedRequestOrOrder),
      redirectUrl,
      header: selectedRequestOrOrder.value.sendNotificationTitle,
    });
  };
}
