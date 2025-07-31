import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { TranslationKeys } from '../definitions/constants';
import { DocumentDetail } from '../definitions/definition';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat, getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';

import { getDocumentDetails, getDocumentsAdditionalInformation } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getSendNotifications } from './helpers/TribunalOrderOrRequestHelper';

const logger = getLogger('TribunalOrdersAndRequestsController');
export class TribunalOrdersAndRequestsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const languageParam = getLanguageParam(req.url);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.NOTIFICATIONS, { returnObjects: true }),
    };

    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
      );

      const notifications: SendNotificationTypeItem[] = await getSendNotifications(
        req.session.userCase?.sendNotificationCollection,
        translations,
        languageParam
      );

      const respondents = req.session.userCase.respondents;
      const selectedRespondent = respondents[0];

      const et3ProcessingDoc: DocumentDetail = {
        description: '',
        id: getDocId(selectedRespondent.et3Vetting.et3VettingDocument.document_url),
        originalDocumentName: selectedRespondent.et3Vetting.et3VettingDocument.document_filename,
      };

      const servingDocuments = await getServingDocs(
        req.session.userCase,
        req.session.user?.accessToken,
        et3ProcessingDoc
      );

      const content = getPageContent(req, <FormContent>{}, [
        TranslationKeys.SIDEBAR_CONTACT_US,
        TranslationKeys.COMMON,
        TranslationKeys.NOTIFICATIONS,
      ]);
      res.render(TranslationKeys.NOTIFICATIONS, {
        ...content,
        notifications,
        servingDocuments,
        translations,
        languageParam,
        welshEnabled,
      });
    } catch (error) {
      logger.error(error.message);
      return res.redirect('/not-found');
    }
  };
}

async function getServingDocs(userCase: CaseWithId, accessToken: string, et3ProcessingDoc: DocumentDetail) {
  const servingDocs = userCase.servingDocuments;
  servingDocs.push(et3ProcessingDoc);

  try {
    await getDocumentDetails(servingDocs, accessToken);
    await getDocumentsAdditionalInformation(servingDocs, accessToken);
  } catch (err) {
    logger.error(err.message);
  }

  return servingDocs;
}
