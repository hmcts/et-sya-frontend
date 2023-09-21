import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getFilesRows = (
  userCase: CaseWithId | undefined,
  appId: string,
  translations: AnyRecord
): SummaryListRow[] => {
  if (userCase === undefined || userCase.supportingMaterialFile === undefined) {
    return [
      {
        key: {
          html: translations.noFilesUpload,
          classes: 'govuk-!-font-weight-regular-m',
        },
      },
    ];
  } else {
    return [
      addSummaryRow(
        userCase.supportingMaterialFile.document_filename,
        '',
        createChangeAction(
          PageUrls.REMOVE_SUPPORTING_MATERIAL.replace(':appId', appId),
          translations.remove,
          translations.remove
        )
      ),
    ];
  }
};
