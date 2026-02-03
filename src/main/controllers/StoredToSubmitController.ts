import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, ServiceErrors, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';
import { createDownloadLink, findSelectedGenericTseApplication, getDocumentLink } from './helpers/DocumentHelpers';
import { returnSessionErrors } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getAppDetailsLink, getCancelLink } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { StoredToSubmitContentForm, clearTseFields, putSelectedAppToUserCase } from './helpers/StoredToSubmitHelpers';

const logger = getLogger('StoredToSubmitController');

export default class StoredToSubmitController {
  private readonly form: Form;

  private readonly StoredToSubmitContent: FormContent = StoredToSubmitContentForm;

  constructor() {
    this.form = new Form(<FormFields>this.StoredToSubmitContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session?.userCase;

    const selectedApplication = findSelectedGenericTseApplication(
      userCase.tseApplicationStoredCollection,
      req.params?.appId
    );
    if (!selectedApplication) {
      logger.error(ServiceErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedGenericTseApplication = selectedApplication;

    const errors = returnSessionErrors(req, this.form);
    if (errors.length > 0) {
      req.session.errors = errors;
      return res.redirect(PageUrls.STORED_TO_SUBMIT.replace(':appId', selectedApplication.id) + languageParam);
    }
    req.session.errors = [];

    // Update Hub Links Statuses
    try {
      userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.IN_PROGRESS;
      await handleUpdateHubLinksStatuses(req, logger);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    // Submit Stored Application
    try {
      putSelectedAppToUserCase(userCase);
      await getCaseApi(req.session.user?.accessToken).storedToSubmitClaimantTse(req.session.userCase);
      clearTseFields(userCase);
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
    const selectedApplication = findSelectedGenericTseApplication(
      userCase.tseApplicationStoredCollection,
      req.params?.appId
    );
    if (!selectedApplication) {
      logger.error(ServiceErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedGenericTseApplication = selectedApplication;

    const document = selectedApplication.value?.documentUpload;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    const content = getPageContent(req, this.StoredToSubmitContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STORED_TO_SUBMIT,
    ]);

    res.render(TranslationKeys.STORED_TO_SUBMIT, {
      ...content,
      title: translations.applicationTo + translations[selectedApplication.value.type],
      appContent: getTseApplicationDetails(
        selectedApplication,
        translations,
        createDownloadLink(document),
        selectedApplication.value.date
      ),
      viewCorrespondenceLink: getAppDetailsLink(req.params.appId, getLanguageParam(req.url)),
      document,
      viewCorrespondenceFileLink: getDocumentLink(document),
      cancelLink: getCancelLink(req),
    });
  };
}
