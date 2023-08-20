import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getFilesRows = (
  userCase: CaseWithId | undefined,
  appId: string,
  translations: AnyRecord
): SummaryListRow[] => {
  const { remove } = translations.remove;

  if (!userCase?.supportingMaterialFile) {
    return [addSummaryRow(translations.noFilesUpload, '')];
  }

  return [
    addSummaryRow(userCase.supportingMaterialFile.document_filename, '', undefined,
      createChangeAction(PageUrls.REMOVE_SUPPORTING_MATERIAL.replace(':appId', appId), remove, remove)
    ),
  ];
};
