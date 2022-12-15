import {AnyRecord} from "../../definitions/util-types";
import {InterceptPaths} from "../../definitions/constants";
import {CaseWithId} from "../../definitions/case";


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
            text: "",
          },
          actions: {
            items: [
            ],
          },
        }];
    } else {
      return [
        {
          key: {
            text: userCase.contactApplicationFile.document_filename,

            classes: 'govuk-!-font-weight-regular-m',
          },
          value: {
            text: "",
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
        }];
    }
};
