import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getFiles = (userCase: CaseWithId, application: string, translations: AnyRecord): SummaryListRow[] => {
  if (!userCase?.contactApplicationFile) {
    return [addSummaryRow(translations.noFilesUpload, '')];
  }

  const { remove } = translations;
  return [
    addSummaryRow(userCase.contactApplicationFile.document_filename, undefined, undefined,
      createChangeAction(PageUrls.REMOVE_FILE.replace(':application', application), remove, remove)
    )
  ];
};
