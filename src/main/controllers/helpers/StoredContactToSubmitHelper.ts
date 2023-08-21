import { AppRequest } from '../../definitions/appRequest';
import { TranslationKeys } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

import { getTseApplicationDetails } from './ApplicationDetailsHelper';
import { createDownloadLink, findSelectedGenericTseApplication } from './DocumentHelpers';

export const getCaptionTextForStoredContact = (req: AppRequest): string => {
  const userCase = req.session.userCase;
  const selectedApplication = findSelectedGenericTseApplication(
    userCase.genericTseApplicationCollection,
    req.params.appId
  );
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };
  return translations.applicationTo + translations[selectedApplication.value.type];
};

export const getTseApplicationDetailsTable = (
  req: AppRequest
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  const userCase = req.session.userCase;
  const selectedApplication = findSelectedGenericTseApplication(
    userCase.genericTseApplicationCollection,
    req.params.appId
  );
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };
  const document = selectedApplication.value?.documentUpload;
  const downloadLink = createDownloadLink(document);
  return getTseApplicationDetails(selectedApplication, translations, downloadLink);
};
