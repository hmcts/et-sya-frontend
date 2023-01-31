import logger from '@pact-foundation/pact/src/common/logger';
import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  getDocumentAdditionalInformation,
} from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    const selectedApplication = findSelectedGenericTseApplication(
      req.session.userCase.genericTseApplicationCollection,
      req.params.appId
    );
    //To save selected Tse application number, will be cleared if press 'Back'(to 'claim-details')
    req.session.userCase.selectedGenericTseApplicationNumber = selectedApplication.value.number;

    const header = translations.applicationTo + translations[selectedApplication.value.type];

    try {
      await getDocumentAdditionalInformation(selectedApplication.value?.documentUpload, req.session.user?.accessToken);
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }

    const downloadLink = createDownloadLink(selectedApplication.value?.documentUpload);

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.APPLICATION_DETAILS,
    ]);

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...content,
      header,
      selectedApplication,
      downloadLink,
    });
  };
}
