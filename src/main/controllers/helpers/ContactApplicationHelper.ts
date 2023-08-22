import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getFiles = (userCase: CaseWithId, application: string, translations: AnyRecord): SummaryListRow[] => {
  if (!userCase?.contactApplicationFile) {
    // TODO: Remove html in the translations file
    return [{ key: { html: translations.noFilesUpload, classes: 'govuk-!-font-weight-regular-m' } }];
  }

  const { remove } = translations;
  return [
    addSummaryRow(
      userCase.contactApplicationFile.document_filename,
      '',
      createChangeAction(PageUrls.REMOVE_FILE.replace(':application', application), remove, remove)
    ),
  ];
};
