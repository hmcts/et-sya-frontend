import logger from '@pact-foundation/pact/src/common/logger';
import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  getDocumentAdditionalInformation,
} from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class RespondentApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const selectedApplication = findSelectedGenericTseApplication(
      req.session.userCase.genericTseApplicationCollection,
      req.params.appId
    );

    //Selected Tse application will be saved in the state.State will be cleared if you press 'Back'(to 'claim-details')
    req.session.userCase.selectedGenericTseApplication = selectedApplication;

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const document = selectedApplication.value?.documentUpload;
    const redirectUrl = `/respond-to-application/${selectedApplication.value.number}${getLanguageParam(req.url)}`;

    if (document) {
      try {
        await getDocumentAdditionalInformation(document, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect('/not-found');
      }
    }

    const downloadLink = createDownloadLink(document);

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPONDENT_APPLICATION_DETAILS,
    ]);

    res.render(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, {
      ...content,
      header,
      insetText,
      selectedApplication,
      redirectUrl,
    });
  };
}
