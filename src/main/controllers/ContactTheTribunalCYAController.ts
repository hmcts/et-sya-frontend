import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ContactTheTribunalCYAController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.CONTACT_THE_TRIBUNAL_CYA,
    ]);

    const cancelPage = setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    };

    const applicationFile = userCase?.contactApplicationFile;
    let downloadLink = '';
    if (
      applicationFile &&
      applicationFile.document_size &&
      applicationFile.document_mime_type &&
      applicationFile.document_filename
    ) {
      downloadLink =
        "<a href='/getSupportingMaterial/' target='_blank' class='govuk-link'>" +
        applicationFile.document_filename +
        '(' +
        applicationFile.document_mime_type +
        ', ' +
        applicationFile.document_size +
        'MB)' +
        '</a>';
    }

    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, {
      ...content,
      ...translations,
      typeOfApplication: translations.sections[userCase.contactApplicationType].label,
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      errors: req.session.errors,
      cancelPage,
      downloadLink,
      languageParam: getLanguageParam(req.url),
      contactTheTribunalSelectedUrl: PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(
        ':selectedOption',
        userCase.contactApplicationType
      ),
    });
  }
}
