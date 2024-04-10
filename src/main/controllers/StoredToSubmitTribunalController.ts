import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { returnSessionErrors } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getCancelLink, getSendNotificationDetailsLink } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import {
  StoredToSubmitContentForm,
  findSelectedPseResponse,
  findSelectedSendNotification,
} from './helpers/StoredToSubmitHelpers';
import { getSinglePseResponseDisplay } from './helpers/TribunalOrderOrRequestHelper';

const logger = getLogger('StoredToSubmitTribunalController');

export default class StoredToSubmitTribunalController {
  private readonly form: Form;

  private readonly StoredToSubmitContent: FormContent = StoredToSubmitContentForm;

  constructor() {
    this.form = new Form(<FormFields>this.StoredToSubmitContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session.userCase;

    const selectedNotification = findSelectedSendNotification(userCase.sendNotificationCollection, req.params.orderId);
    if (selectedNotification === undefined) {
      logger.error('Selected send notification not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedRequestOrOrder = selectedNotification;

    const selectedResponse = findSelectedPseResponse(
      selectedNotification.value.respondStoredCollection,
      req.params.responseId
    );
    if (selectedResponse === undefined) {
      logger.error('Selected response not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedStoredPseResponse = selectedResponse;

    const errors = returnSessionErrors(req, this.form);
    if (errors.length > 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }
    req.session.errors = [];

    try {
      await getCaseApi(req.session.user?.accessToken).storedToSubmitRespondToTribunal(req.session.userCase);
      userCase.selectedRequestOrOrder = undefined;
      userCase.selectedStoredPseResponse = undefined;
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    return res.redirect(PageUrls.APPLICATION_COMPLETE + languageParam);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.documentDownloadPage = PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS;
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session.userCase;

    const selectedNotification = findSelectedSendNotification(userCase.sendNotificationCollection, req.params.orderId);
    if (selectedNotification === undefined) {
      logger.error('Selected send notification not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedRequestOrOrder = selectedNotification;

    const selectedResponse = findSelectedPseResponse(
      selectedNotification.value.respondStoredCollection,
      req.params.responseId
    );
    if (selectedResponse === undefined) {
      logger.error('Selected response not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedStoredPseResponse = selectedResponse;

    const headerTranslations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, { returnObjects: true }),
    };

    let appContent;
    try {
      const detailsTranslations: AnyRecord = {
        ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
        ...req.t(TranslationKeys.TRIBUNAL_RESPONSE_CYA, { returnObjects: true }),
      };
      appContent = await getSinglePseResponseDisplay(selectedResponse, detailsTranslations, req);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    const content = getPageContent(req, this.StoredToSubmitContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STORED_TO_SUBMIT,
    ]);

    res.render(TranslationKeys.STORED_TO_SUBMIT, {
      ...content,
      title: headerTranslations.caption,
      appContent,
      viewCorrespondenceLink: getSendNotificationDetailsLink(req.params.orderId, getLanguageParam(req.url)),
      cancelLink: getCancelLink(req),
    });
  };
}
