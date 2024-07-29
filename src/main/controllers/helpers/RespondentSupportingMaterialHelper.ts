import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { findSelectedGenericTseApplication } from './DocumentHelpers';
import { findSelectedSendNotification } from './StoredToSubmitHelpers';

export const getFilesRows = (
  languageParam: string,
  userCase: CaseWithId | undefined,
  appId: string,
  translations: AnyRecord
): SummaryListRow[] => {
  if (userCase === undefined || userCase.supportingMaterialFile === undefined) {
    return [
      {
        key: {
          html: '<p class="govuk-body">' + translations.noFilesUpload + '</p>',
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
          PageUrls.REMOVE_SUPPORTING_MATERIAL.replace(':appId', appId) + languageParam,
          translations.remove,
          translations.remove
        )
      ),
    ];
  }
};
export const findSelectedParamId = (userCase: CaseWithId, param: string): string => {
  const selectedApplication = findSelectedGenericTseApplication(userCase.genericTseApplicationCollection, param);
  if (selectedApplication !== undefined) {
    return selectedApplication.id;
  }

  const selectedRequestOrOrder = findSelectedSendNotification(userCase.sendNotificationCollection, param);
  if (selectedRequestOrOrder !== undefined) {
    return selectedRequestOrOrder.id;
  }

  return undefined;
};
