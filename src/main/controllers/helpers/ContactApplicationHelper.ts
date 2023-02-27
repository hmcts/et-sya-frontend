import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getFiles = (
  userCase: CaseWithId | undefined,
  selectedApplication: string,
  translations: AnyRecord
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  if (userCase === undefined || userCase.contactApplicationFile === undefined) {
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
          text: userCase.contactApplicationFile.document_filename,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: '',
        },
        actions: {
          items: [
            {
              href: PageUrls.REMOVE_FILE.replace(':application', selectedApplication),
              text: translations.remove,
              visuallyHiddenText: translations.remove,
            },
          ],
        },
      },
    ];
  }
};
