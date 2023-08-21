import { CaseWithId } from '../../definitions/case';
import { AnyRecord } from '../../definitions/util-types';

import { createDownloadLink } from './DocumentHelpers';

export const getViewSupportingDoc = (userCase: CaseWithId, translations: AnyRecord): string => {
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
