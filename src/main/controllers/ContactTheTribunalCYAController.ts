import { Response } from 'express';

import { FormSubmissionCheck } from '../decorators/FormSubmissionCheck';
import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getCyaContent } from './helpers/ContactTheTribunalCYAHelper';
import { createDownloadLink } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ContactTheTribunalCYANotSystemUserController');

export default class ContactTheTribunalCYAController {
  @FormSubmissionCheck()
  public async get(req: AppRequest, res: Response): Promise<void> {
    const userCase = req.session?.userCase;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_THE_TRIBUNAL_CYA,
    ]);

    const cancelPage = setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, { returnObjects: true }),
    };

    const downloadLink = createDownloadLink(userCase?.contactApplicationFile);

    const welshEnabled = await getFlagValue('welsh-language', null);
    const languageParam = getLanguageParam(req.url);

    logger.info('Retrieve translation label for contactApplicationType for caseId: ' + userCase?.id);
    const cyaContent = getCyaContent(
      userCase,
      translations,
      languageParam,
      PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', userCase.contactApplicationType),
      downloadLink,
      translations.sections[userCase.contactApplicationType].label
    );

    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, {
      ...content,
      ...translations,
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      errors: req.session.errors,
      cancelPage,
      submitRef: InterceptPaths.SUBMIT_TRIBUNAL_CYA + languageParam,
      cyaContent,
      welshEnabled,
    });
  }
}
