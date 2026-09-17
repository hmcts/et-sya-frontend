import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { retrieveCurrentLocale } from './helpers/ApplicationTableRecordTranslationHelper';
import { isGroupClaim } from './helpers/CaseHelpers';
import { findSelectedGenericTseApplication, getDocumentLink } from './helpers/DocumentHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getAppDetailsLink, getCancelLink } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('StoredApplicationConfirmationController');

export default class StoredApplicationConfirmationController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session?.userCase;

    if (req.params.appId === undefined) {
      logger.error('Application ID not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    const selectedApplication = findSelectedGenericTseApplication(
      userCase?.tseApplicationStoredCollection,
      req.params.appId
    );
    if (selectedApplication === undefined) {
      logger.error('Latest application not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    const welshEnabled = await getFlagValue('welsh-language', null);

    if (isGroupClaim(userCase)) {
      const redirectUrl = `/citizen-hub/${userCase?.id}${languageParam}`;
      const applicationDate = new Date();
      applicationDate.setDate(applicationDate.getDate() + 7);
      const dateString = applicationDate.toLocaleDateString(retrieveCurrentLocale(req?.url), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const rule92 = selectedApplication.value?.copyToOtherPartyYesOrNo === YesOrNo.YES;

      return res.render(TranslationKeys.APPLICATION_COMPLETE, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.APPLICATION_COMPLETE, { returnObjects: true }),
        applicationDate: dateString,
        rule92,
        redirectUrl,
        yourApplicationsUrl: setUrlLanguage(req, PageUrls.GROUP_CLAIM_REQUESTS_AND_APPLICATIONS),
        welshEnabled,
      });
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_APPLICATION_CONFIRMATION, { returnObjects: true }),
    };

    const document = selectedApplication.value.documentUpload;

    res.render(TranslationKeys.STORED_APPLICATION_CONFIRMATION, {
      ...translations,
      redirectUrl: getCancelLink(req),
      viewThisCorrespondenceLink: getAppDetailsLink(selectedApplication.id, languageParam),
      document,
      documentLink: getDocumentLink(document),
    });
  }
}
