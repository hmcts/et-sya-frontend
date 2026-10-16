import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getCyaContent } from './helpers/ContactTheTribunalCYAHelper';
import { createDownloadLink } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getCancelLink } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ContactTheTribunalCYANotSystemUserController');

export default class ContactTheTribunalCYANotSystemUserController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);

    if (userCase.contactApplicationType === undefined) {
      logger.error('Selected application not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_THE_TRIBUNAL_CYA,
    ]);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, { returnObjects: true }),
    };

    const downloadLink = createDownloadLink(userCase?.contactApplicationFile);

    const welshEnabled = await getFlagValue('welsh-language', null);

    logger.info('Retrieve translation label for contactApplicationType for caseId: ' + userCase?.id);
    const cyaContent = getCyaContent(
      userCase,
      translations,
      languageParam,
      PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', userCase.contactApplicationType),
      downloadLink,
      translations.sections[userCase.contactApplicationType]?.label
    );

    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER, {
      ...content,
      cancelPage: getCancelLink(req),
      storedUrl: InterceptPaths.STORE_TRIBUNAL_CYA + getLanguageParam(req.url),
      cyaContent,
      welshEnabled,
    });
  }
}
