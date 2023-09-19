import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getFiles = (
  userCase: CaseWithId | undefined,
  selectedApplication: string,
  translations: AnyRecord
): SummaryListRow[] => {
  if (userCase === undefined || userCase.contactApplicationFile === undefined) {
    return [
      {
        key: {
          text: translations.noFilesUpload,
          classes: 'govuk-body govuk-!-font-weight-regular govuk-!-width-three-quarters',
        },
      },
    ];
  } else {
    return [
      addSummaryRow(
        userCase.contactApplicationFile.document_filename,
        '',
        createChangeAction(
          PageUrls.REMOVE_FILE.replace(':application', selectedApplication),
          translations.remove,
          translations.remove
        )
      ),
    ];
  }
};
