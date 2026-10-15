import { Response } from 'express';

import { FormSubmissionCheck } from '../decorators/FormSubmissionCheck';
import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import applications, { DOCUMENTS } from '../definitions/contact-applications';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { isClaimantRepresentedByOrganisation } from './helpers/ContactTheTribunalHelper';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('SharingCommunicationController');

export default class SharingCommunicationController {
  @FormSubmissionCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const languageParam = getLanguageParam(req.url);

    if (isClaimantRepresentedByOrganisation(req.session.userCase)) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    if (req.query?.selectedOption) {
      const selectedOptionParam = req.query.selectedOption as string;
      const selectedApp = applications.find(appType => appType === selectedOptionParam);
      if (selectedApp) {
        req.session.userCase.contactApplicationType = selectedApp;
      }
    }

    const selectedApplication = req.session.userCase?.contactApplicationType || 'withdraw';

    const content = getPageContent(req, { fields: {} } as FormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.CONTACT_THE_TRIBUNAL,
      TranslationKeys.SHARING_COMMUNICATION,
    ]);

    const contactTribunalTranslations: AnyRecord = req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true });
    const applicationType =
      contactTribunalTranslations?.sections?.[selectedApplication]?.caption ||
      contactTribunalTranslations?.sections?.withdraw?.caption ||
      'Withdraw my claim';

    res.render(TranslationKeys.SHARING_COMMUNICATION, {
      ...content,
      applicationType,
      cancelUrl: PageUrls.CONTACT_THE_TRIBUNAL + languageParam,
      postUrl: PageUrls.SHARING_COMMUNICATION + languageParam,
      hideContactUs: true,
      welshEnabled,
    });
  };

  @FormSubmissionCheck()
  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    req.session.contactTribunalSharingCommunicationConfirmed = true;

    const selectedApplication = req.session.userCase?.contactApplicationType || 'withdraw';

    let redirectUrl: string;
    if (selectedApplication === DOCUMENTS) {
      redirectUrl = PageUrls.PREPARE_DOCUMENTS + languageParam;
    } else {
      redirectUrl = PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', selectedApplication) + languageParam;
    }

    logger.info(
      `Sharing communication confirmed for application: ${selectedApplication}, redirecting to ${redirectUrl}`
    );
    return res.redirect(redirectUrl);
  };
}
