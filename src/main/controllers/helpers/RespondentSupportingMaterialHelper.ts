import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getFilesRows = (
  userCase: CaseWithId | undefined,
  appId: string,
  translations: AnyRecord
): SummaryListRow[] => {
  const { remove } = translations;

  if (!userCase?.supportingMaterialFile) {
    // TODO: Remove the html from the translation file for this
    return [{ key: { html: translations.noFilesUpload, classes: 'govuk-!-font-weight-regular-m' } }];
  }

  return [
    addSummaryRow(
      userCase.supportingMaterialFile.document_filename,
      '',
      createChangeAction(PageUrls.REMOVE_SUPPORTING_MATERIAL.replace(':appId', appId), remove, remove)
    ),
  ];
};
