import { Response } from 'express';

import { Form } from '../components/form/form';
import { validateTitlePreference } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { Sex } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('SexAndTitleController');

export default class SexAndTitleController {
  private readonly form: Form;
  private readonly sexAndTitleContent: FormContent = {
    fields: {
      claimantSex: {
        classes: 'govuk-radios govuk-!-margin-bottom-6',
        id: 'sex',
        type: 'radios',
        labelSize: 'm',
        label: (l: AnyRecord): string => l.sex,
        values: [
          {
            label: (l: AnyRecord): string => l.male,
            value: Sex.MALE,
          },
          {
            label: (l: AnyRecord): string => l.female,
            value: Sex.FEMALE,
          },
          {
            label: (l: AnyRecord): string => l.preferNotToSay,
            value: Sex.PREFER_NOT_TO_SAY,
          },
        ],
      },
      preferredTitle: {
        id: 'preferredTitle',
        type: 'text',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord) => l.preferredTitle,
        labelSize: 'm',
        attributes: { maxLength: 20 },
        validator: validateTitlePreference,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.sexAndTitleContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.ADDRESS_POSTCODE_ENTER);
  };

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.claimantSex = undefined;
      req.session.userCase.preferredTitle = undefined;
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    checkCaseStateAndRedirect(req, res);
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.sexAndTitleContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SEX_AND_TITLE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.SEX_AND_TITLE, {
      ...content,
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
