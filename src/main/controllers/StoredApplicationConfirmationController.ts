import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import { getCancelLink } from './helpers/CopyToOtherPartyHelper';
import { createDownloadLink } from './helpers/DocumentHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

export default class StoredApplicationConfirmationController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;

    const viewThisCorrespondenceLink = getViewThisCorrespondenceLink(req);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_APPLICATION_CONFIRMATION, { returnObjects: true }),
    };

    res.render(TranslationKeys.STORED_APPLICATION_CONFIRMATION, {
      ...translations,
      redirectUrl: getCancelLink(req),
      viewThisCorrespondenceLink,
      viewSupportingDoc: getViewSupportingDoc(userCase, translations),
    });
  }
}

const getViewThisCorrespondenceLink = (req: AppRequest): string => {
  const userCase = req.session?.userCase;
  const link = `/application-details/${userCase.id}`;
  return setUrlLanguage(req, link);
};

const getViewSupportingDoc = (userCase: CaseWithId, translations: AnyRecord): string => {
  if (userCase?.contactApplicationFile === undefined) {
    return '';
  }
  return (
    translations.viewTheSupportingDocuments +
    ': <a href="' +
    createDownloadLink(userCase?.contactApplicationFile) +
    '" class="govuk-link">' +
    userCase?.contactApplicationFile.document_filename +
    '</a>'
  );
};
