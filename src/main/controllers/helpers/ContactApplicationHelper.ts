import { CaseWithId } from '../../definitions/case';
import { InterceptPaths } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getFiles = (
  userCase: CaseWithId | undefined,
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
          text: userCase.contactApplicationFile,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: '',
        },
        actions: {
          items: [
            {
              href: InterceptPaths.REMOVE_FILE,
              text: translations.remove,
              visuallyHiddenText: translations.remove,
            },
          ],
        },
      },
    ];
  }
};
