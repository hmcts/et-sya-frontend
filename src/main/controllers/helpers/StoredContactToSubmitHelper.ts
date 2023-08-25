import { AppRequest } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { TranslationKeys } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

import { getTseApplicationDetails } from './ApplicationDetailsHelper';

export const getCaptionTextForStoredContact = (
  req: AppRequest,
  selectedApplication: GenericTseApplicationTypeItem
): string => {
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };
  return translations.applicationTo + translations[selectedApplication.value.type];
};

export const getTseApplicationDetailsHelper = (
  req: AppRequest,
  selectedApplication: GenericTseApplicationTypeItem,
  downloadLink: string | void
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };
  return getTseApplicationDetails(selectedApplication, translations, downloadLink);
};
