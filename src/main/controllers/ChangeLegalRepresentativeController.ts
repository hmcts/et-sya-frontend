import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { LEGAL_REPRESENTATIVE_CHANGE_OPTIONS, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { removeClaimantRepresentative } from './helpers/CaseRoleHelper';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { conditionalRedirect, getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('RespondentApplicationDetailsController');

export default class ChangeLegalRepresentativeController {
  private readonly form: Form;
  private readonly changeLegalRepresentativeContent: FormContent = {
    fields: {
      legalRep: {
        id: 'legalRep',
        type: 'radios',
        label: (l: AnyRecord): string => l.h1,
        labelHidden: false,
        labelSize: 'xl',
        classes: 'govuk-radios--inline',
        values: [
          {
            label: (l: AnyRecord): string => l.legalRepresentativeChange,
            value: LEGAL_REPRESENTATIVE_CHANGE_OPTIONS.change,
          },
          {
            label: (l: AnyRecord): string => l.legalRepresentativeRemove,
            value: LEGAL_REPRESENTATIVE_CHANGE_OPTIONS.remove,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submitBtn,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.changeLegalRepresentativeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const redirectUrl = conditionalRedirect(
        req,
        this.form.getFormFields(),
        LEGAL_REPRESENTATIVE_CHANGE_OPTIONS.change
      )
        ? PageUrls.APPOINT_LEGAL_REPRESENTATIVE
        : await removeClaimantRepresentative(req);
      res.redirect(redirectUrl);
    } catch (error) {
      logger.info(error);
      req.session.errors.push({ propertyName: 'legalRep', errorType: 'backEndError' });
      res.redirect(req.url);
    }
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const citizenHubUrl = setUrlLanguage(req, TranslationKeys.CITIZEN_HUB + '/' + req.session.userCase.id);
    const contactTheTribunalUrl = setUrlLanguage(req, TranslationKeys.CONTACT_THE_TRIBUNAL + '/other');
    const content = getPageContent(req, this.changeLegalRepresentativeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.CHANGE_LEGAL_REPRESENTATIVE,
    ]);
    res.render(TranslationKeys.CHANGE_LEGAL_REPRESENTATIVE, {
      ...content,
      PageUrls,
      citizenHubUrl,
      contactTheTribunalUrl,
      languageParam: getLanguageParam(req.url),
    });
  };
}
