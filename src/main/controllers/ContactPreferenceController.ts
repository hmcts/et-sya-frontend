import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { EmailOrPost } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getCaseApi } from '../services/CaseService';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class ContactPreferenceController {
  private readonly form: Form;
  private readonly contactPrefFormContent: FormContent = {
    fields: {
      claimant_contact_preference: {
        classes: 'govuk-radios--inline',
        id: 'contact-preference',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            label: (l: AnyRecord): string => l.email,
            name: 'email',
            value: EmailOrPost.EMAIL,
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.post,
            name: 'post',
            value: EmailOrPost.POST,
            attributes: { maxLength: 2 },
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.contactPrefFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.HEARING_PREFERENCE);
    if (!req.session.errors.length) {
      getCaseApi(req.session.user?.accessToken)
        .updateDraftCase(req.session.userCase)
        .then(() => {
          this.logger.info(`Updated draft case id: ${req.session.userCase.id}`);
        })
        .catch(error => {
          this.logger.info(error);
        });
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.contactPrefFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_PREFERENCE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CONTACT_PREFERENCE, {
      ...content,
    });
  };
}
