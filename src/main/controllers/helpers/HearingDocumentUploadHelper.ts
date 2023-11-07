import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getFilesRows = (
  userCase: CaseWithId | undefined,
  appId: string,
  translations: AnyRecord
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  if (userCase === undefined || userCase.hearingDocument === undefined) {
    return [
      {
        key: {
          html: translations.noFilesUpload,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: '',
        },
        actions: {
          items: [],
        },
      },
    ];
  } else {
    return [
      {
        key: {
          text: userCase.hearingDocument.document_filename,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: '',
        },
        actions: {
          items: [
            {
              href: PageUrls.HEARING_DOCUMENT_REMOVE.replace(':appId', appId),
              text: translations.remove,
              visuallyHiddenText: translations.remove,
            },
          ],
        },
      },
    ];
  }
};
