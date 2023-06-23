import logger from '@pact-foundation/pact/src/common/logger';
import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getVisibleRequestFromAdmin, responseRequired } from './helpers/AdminNotificationHelper';
import { getAllResponses, getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  getDocumentAdditionalInformation,
} from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    req.session.documentDownloadPage = PageUrls.APPLICATION_DETAILS;

    const userCase = req.session.userCase;
    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );
    //Selected Tse application will be saved in the state.State will be cleared if you press 'Back'(to 'claim-details')
    userCase.selectedGenericTseApplication = selectedApplication;

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const document = selectedApplication.value?.documentUpload;

    const adminRequests = getVisibleRequestFromAdmin(selectedApplication, translations, getLanguageParam(req.url));
    const respondButton = responseRequired(adminRequests);

    if (document) {
      try {
        await getDocumentAdditionalInformation(document, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect('/not-found');
      }
    }

    const downloadLink = createDownloadLink(document);

    const allResponses = await getAllResponses(
      selectedApplication.value.respondCollection,
      translations,
      req.session.user?.accessToken,
      res
    );

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.APPLICATION_DETAILS,
    ]);

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...content,
      header,
      selectedApplication,
      appContent: getTseApplicationDetails(selectedApplication, translations, downloadLink),
      respondButton,
      allResponses,
    });
  };
}
