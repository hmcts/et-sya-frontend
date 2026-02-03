import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, ServiceErrors, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { getResponseDisplay } from './helpers/ApplicationDetailsHelper';
import { findSelectedGenericTseApplication } from './helpers/DocumentHelpers';
import { returnSessionErrors } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getAppDetailsLink, getCancelLink } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { StoredToSubmitContentForm } from './helpers/StoredToSubmitHelpers';

const logger = getLogger('StoredToSubmitResponseController');

export default class StoredToSubmitResponseController {
  private readonly form: Form;

  private readonly StoredToSubmitContent: FormContent = StoredToSubmitContentForm;

  constructor() {
    this.form = new Form(<FormFields>this.StoredToSubmitContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const { userCase } = req.session;

    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params?.appId
    );
    if (!selectedApplication) {
      logger.error(ServiceErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedGenericTseApplication = selectedApplication;

    const selectedResponse = selectedApplication.value.respondStoredCollection?.find(
      r => r.id === req.params.responseId
    );
    if (selectedResponse === undefined) {
      logger.error('Selected response not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedStoredTseResponse = selectedResponse;

    const errors = returnSessionErrors(req, this.form);
    if (errors.length > 0) {
      req.session.errors = errors;
      return res.redirect(
        PageUrls.STORED_TO_SUBMIT_RESPONSE.replace(':appId', selectedApplication.id).replace(
          ':responseId',
          selectedResponse.id
        ) + languageParam
      );
    }
    req.session.errors = [];

    try {
      await getCaseApi(req.session.user?.accessToken).storedToSubmitRespondToApp(req.session.userCase);
      userCase.selectedGenericTseApplication = undefined;
      userCase.selectedStoredTseResponse = undefined;
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    return res.redirect(PageUrls.APPLICATION_COMPLETE + languageParam);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.documentDownloadPage = PageUrls.APPLICATION_DETAILS;
    const languageParam = getLanguageParam(req.url);
    const { userCase } = req.session;
    const accessToken = req.session.user?.accessToken;

    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params?.appId
    );
    if (!selectedApplication) {
      logger.error(ServiceErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedGenericTseApplication = selectedApplication;

    const selectedResponse = selectedApplication.value.respondStoredCollection?.find(
      r => r.id === req.params.responseId
    );
    if (selectedResponse === undefined) {
      logger.error('Selected response not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedStoredTseResponse = selectedResponse;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    let appContent;
    try {
      appContent = await getResponseDisplay(selectedResponse, translations, accessToken);
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
      title: translations.applicationTo + translations[selectedApplication.value.type],
      appContent,
      viewCorrespondenceLink: getAppDetailsLink(req.params.appId, getLanguageParam(req.url)),
      cancelLink: getCancelLink(req),
    });
  };
}
