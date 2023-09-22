import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  getDocumentLink,
  populateDocumentMetadata,
} from './helpers/DocumentHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam, returnNextPage } from './helpers/RouterHelpers';
import { getAppDetailsLink, getCancelLink } from './helpers/Rule92NotSystemUserHelper';

const logger = getLogger('StoredToSubmitController');

export default class StoredToSubmitController {
  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const confirmCopied = req.body.confirmCopied;
    if (!confirmCopied || (confirmCopied as []).length === 0) {
      req.session.errors = [{ errorType: 'required', propertyName: 'confirmCopied' }];
      return res.redirect(req.url);
    }
    req.session.errors = [];
    returnNextPage(req, res, setUrlLanguage(req, InterceptPaths.STORED_TO_SUBMIT_UPDATE));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session.userCase;
    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );
    userCase.selectedGenericTseApplication = selectedApplication;

    const document = selectedApplication?.value?.documentUpload;
    const accessToken = req.session.user?.accessToken;
    if (document) {
      try {
        await populateDocumentMetadata(document, accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
      }
    }

    const appTranslations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_TO_SUBMIT, { returnObjects: true }),
    };

    res.render(TranslationKeys.STORED_TO_SUBMIT, {
      ...translations,
      applicationType: appTranslations.applicationTo + appTranslations[selectedApplication.value.type],
      appContent: getTseApplicationDetails(selectedApplication, appTranslations, createDownloadLink(document)),
      viewCorrespondenceLink: getAppDetailsLink(req.params.appId, getLanguageParam(req.url)),
      document,
      viewCorrespondenceFileLink: getDocumentLink(document),
      cancelLink: getCancelLink(req),
      errors: req.session.errors,
      errorMessage: translations.errors.confirmCopied.required,
    });
  };
}
